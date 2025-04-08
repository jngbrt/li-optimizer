import { neon } from "@neondatabase/serverless"
import { v4 as uuidv4 } from "uuid"
import type { ContentSample, StyleInsights, StyleProfile, GeneratedContent } from "@/lib/types"

// Initialize the Neon client
const sql = neon(process.env.DATABASE_URL!)

// Function to save a content sample
export async function saveContentSample(
  contentSample: Omit<ContentSample, "id" | "createdAt" | "updatedAt">,
): Promise<string> {
  const id = uuidv4()
  await sql`
    INSERT INTO content_samples (
      id, user_id, title, content, content_type, word_count, source, source_url
    ) VALUES (
      ${id}, ${contentSample.userId}, ${contentSample.title || null}, ${contentSample.content},
      ${contentSample.contentType}, ${contentSample.wordCount}, ${contentSample.source}, ${contentSample.sourceUrl || null}
    )
  `
  return id
}

// Function to save a style profile
export async function saveStyleProfile(
  profile: Omit<StyleProfile, "id" | "createdAt" | "updatedAt" | "styleInsights">,
): Promise<string> {
  const id = uuidv4()
  await sql`
    INSERT INTO style_profiles (
      id, user_id, name, description, sample_count
    ) VALUES (
      ${id}, ${profile.userId}, ${profile.name}, ${profile.description || null}, ${profile.sampleCount}
    )
  `
  return id
}

// Function to save style insights
export async function saveStyleInsights(profileId: string, styleInsights: StyleInsights): Promise<void> {
  await sql`
    INSERT INTO style_insights (
      profile_id, tone_formal, tone_conversational, tone_inspirational,
      sentence_simple, sentence_compound, sentence_complex,
      vocabulary_level, average_sentence_length, common_phrases, topic_areas
    ) VALUES (
      ${profileId}, ${styleInsights.toneDistribution.formal}, ${styleInsights.toneDistribution.conversational},
      ${styleInsights.toneDistribution.inspirational}, ${styleInsights.sentenceStructure.simple},
      ${styleInsights.sentenceStructure.compound}, ${styleInsights.sentenceStructure.complex},
      ${styleInsights.vocabularyLevel}, ${styleInsights.averageSentenceLength},
      ${styleInsights.commonPhrases}, ${styleInsights.topicAreas}
    )
  `
}

// Function to get a style profile by ID
export async function getStyleProfileById(id: string): Promise<StyleProfile | null> {
  const profiles = await sql`
    SELECT 
      sp.id, 
      sp.user_id,
      sp.name, 
      sp.description, 
      sp.sample_count,
      si.tone_formal as "styleInsights.toneDistribution.formal",
      si.tone_conversational as "styleInsights.toneDistribution.conversational",
      si.tone_inspirational as "styleInsights.toneDistribution.inspirational",
      si.sentence_simple as "styleInsights.sentenceStructure.simple",
      si.sentence_compound as "styleInsights.sentenceStructure.compound",
      si.sentence_complex as "styleInsights.sentenceStructure.complex",
      si.vocabulary_level as "styleInsights.vocabularyLevel",
      si.average_sentence_length as "styleInsights.averageSentenceLength",
      si.common_phrases as "styleInsights.commonPhrases",
      si.topic_areas as "styleInsights.topicAreas",
      sp.created_at,
      sp.updated_at
    FROM style_profiles sp
    LEFT JOIN style_insights si ON sp.id = si.profile_id
    WHERE sp.id = ${id}
  `

  if (profiles.length === 0) {
    return null
  }

  const profile = profiles[0]

  return {
    id: profile.id,
    userId: profile.user_id,
    name: profile.name,
    description: profile.description || undefined,
    sampleCount: profile.sample_count,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
    styleInsights: {
      toneDistribution: {
        formal: profile["styleInsights.toneDistribution.formal"],
        conversational: profile["styleInsights.toneDistribution.conversational"],
        inspirational: profile["styleInsights.toneDistribution.inspirational"],
      },
      sentenceStructure: {
        simple: profile["styleInsights.sentenceStructure.simple"],
        compound: profile["styleInsights.sentenceStructure.compound"],
        complex: profile["styleInsights.sentenceStructure.complex"],
      },
      vocabularyLevel: profile["styleInsights.vocabularyLevel"],
      averageSentenceLength: profile["styleInsights.averageSentenceLength"],
      commonPhrases: profile["styleInsights.commonPhrases"] || [],
      topicAreas: profile["styleInsights.topicAreas"] || [],
    },
  }
}

// Function to save generated content
export async function saveGeneratedContent(
  generatedContent: Omit<GeneratedContent, "id" | "createdAt">,
): Promise<string> {
  const id = uuidv4()
  await sql`
    INSERT INTO generated_content (
      id, user_id, profile_id, content, content_type, goal, tone, audience
    ) VALUES (
      ${id}, ${generatedContent.userId}, ${generatedContent.profileId}, ${generatedContent.content},
      ${generatedContent.contentType}, ${generatedContent.goal}, ${generatedContent.tone}, ${generatedContent.audience}
    )
  `
  return id
}

// Function to get generated content by user ID
export async function getGeneratedContentByUserId(userId: string): Promise<GeneratedContent[]> {
  const content = await sql`
    SELECT * FROM generated_content
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `

  return content.map((item) => ({
    id: item.id,
    userId: item.user_id,
    profileId: item.profile_id,
    content: item.content,
    contentType: item.content_type,
    goal: item.goal,
    tone: item.tone,
    audience: item.audience,
    createdAt: item.created_at,
  }))
}

// Function to get style profiles by user ID
export async function getStyleProfilesByUserId(userId: string): Promise<StyleProfile[]> {
  const profiles = await sql`
    SELECT id, name, description, sample_count, created_at, updated_at FROM style_profiles
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `

  return profiles.map((profile) => ({
    id: profile.id,
    userId: userId,
    name: profile.name,
    description: profile.description || undefined,
    sampleCount: profile.sample_count,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  }))
}

// Function to delete a style profile
export async function deleteStyleProfile(id: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM style_profiles
    WHERE id = ${id}
  `
  return result.count > 0
}

// Function to get content samples by user ID
export async function getContentSamplesByUserId(userId: string): Promise<ContentSample[]> {
  const samples = await sql`
    SELECT * FROM content_samples
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `

  return samples.map((sample) => ({
    id: sample.id,
    userId: sample.user_id,
    title: sample.title || undefined,
    content: sample.content,
    contentType: sample.content_type,
    wordCount: sample.word_count,
    source: sample.source,
    sourceUrl: sample.source_url || undefined,
    createdAt: sample.created_at,
    updatedAt: sample.updated_at,
  }))
}

// Function to delete a content sample
export async function deleteContentSample(id: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM content_samples
    WHERE id = ${id}
  `
  return result.count > 0
}

// Function to get a post by ID
export async function getPostById(id: string): Promise<GeneratedContent | null> {
  const posts = await sql`
    SELECT * FROM generated_content
    WHERE id = ${id}
  `

  if (posts.length === 0) {
    return null
  }

  const post = posts[0]
  return {
    id: post.id,
    userId: post.user_id,
    profileId: post.profile_id,
    content: post.content,
    contentType: post.content_type,
    goal: post.goal,
    tone: post.tone,
    audience: post.audience,
    createdAt: post.created_at,
  }
}

// Function to update a post
export async function updatePost(
  id: string,
  updates: Partial<Omit<GeneratedContent, "id" | "userId" | "profileId" | "createdAt">>,
): Promise<boolean> {
  // Build the SET clause dynamically based on provided updates
  const updateFields = []
  const values = []

  if (updates.content !== undefined) {
    updateFields.push("content = $1")
    values.push(updates.content)
  }

  if (updates.contentType !== undefined) {
    updateFields.push("content_type = $" + (values.length + 1))
    values.push(updates.contentType)
  }

  if (updates.goal !== undefined) {
    updateFields.push("goal = $" + (values.length + 1))
    values.push(updates.goal)
  }

  if (updates.tone !== undefined) {
    updateFields.push("tone = $" + (values.length + 1))
    values.push(updates.tone)
  }

  if (updates.audience !== undefined) {
    updateFields.push("audience = $" + (values.length + 1))
    values.push(updates.audience)
  }

  // If no updates were provided, return false
  if (updateFields.length === 0) {
    return false
  }

  // Add the updated_at timestamp
  updateFields.push("updated_at = NOW()")

  // Build and execute the query
  const query = `
    UPDATE generated_content
    SET ${updateFields.join(", ")}
    WHERE id = $${values.length + 1}
  `
  values.push(id)

  const result = await sql.query(query, values)
  return result.rowCount > 0
}

// Function to delete a post
export async function deletePost(id: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM generated_content
    WHERE id = ${id}
  `
  return result.count > 0
}

// Function to get posts by user ID
export async function getPostsByUserId(userId: string): Promise<GeneratedContent[]> {
  try {
    const posts = await sql`
      SELECT * FROM generated_content
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    return posts.map((post) => ({
      id: post.id,
      userId: post.user_id,
      profileId: post.profile_id,
      content: post.content,
      contentType: post.content_type,
      goal: post.goal,
      tone: post.tone,
      audience: post.audience,
      createdAt: post.created_at,
    }))
  } catch (error) {
    // Re-throw the error to be handled by the API route
    throw error
  }
}

// Function to create a new post
export async function createPost(post: Omit<GeneratedContent, "id" | "createdAt">): Promise<string> {
  const id = uuidv4()
  await sql`
    INSERT INTO generated_content (
      id, user_id, profile_id, content, content_type, goal, tone, audience
    ) VALUES (
      ${id}, ${post.userId}, ${post.profileId}, ${post.content},
      ${post.contentType}, ${post.goal}, ${post.tone}, ${post.audience}
    )
  `
  return id
}

// Function to get a profile by ID
export async function getProfileById(id: string): Promise<StyleProfile | null> {
  const profiles = await sql`
    SELECT id, user_id, name, description, sample_count, created_at, updated_at
    FROM style_profiles
    WHERE id = ${id}
  `

  if (profiles.length === 0) {
    return null
  }

  const profile = profiles[0]
  return {
    id: profile.id,
    userId: profile.user_id,
    name: profile.name,
    description: profile.description || undefined,
    sampleCount: profile.sample_count,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  }
}
