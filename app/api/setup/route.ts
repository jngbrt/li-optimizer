import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export const runtime = "nodejs"

export async function POST() {
  try {
    // Run the setup script to create all necessary tables
    await sql`
      -- Create style_profiles table
      CREATE TABLE IF NOT EXISTS style_profiles (
        id UUID PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        sample_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      -- Create style_insights table
      CREATE TABLE IF NOT EXISTS style_insights (
        id SERIAL PRIMARY KEY,
        profile_id UUID NOT NULL REFERENCES style_profiles(id) ON DELETE CASCADE,
        tone_formal INTEGER NOT NULL,
        tone_conversational INTEGER NOT NULL,
        tone_inspirational INTEGER NOT NULL,
        sentence_simple INTEGER NOT NULL,
        sentence_compound INTEGER NOT NULL,
        sentence_complex INTEGER NOT NULL,
        vocabulary_level INTEGER NOT NULL,
        average_sentence_length FLOAT NOT NULL,
        common_phrases TEXT[] DEFAULT '{}',
        topic_areas TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      -- Create common_phrases table
      CREATE TABLE IF NOT EXISTS common_phrases (
        id SERIAL PRIMARY KEY,
        profile_id UUID NOT NULL REFERENCES style_profiles(id) ON DELETE CASCADE,
        phrase VARCHAR(255) NOT NULL,
        frequency INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      -- Create topic_areas table
      CREATE TABLE IF NOT EXISTS topic_areas (
        id SERIAL PRIMARY KEY,
        profile_id UUID NOT NULL REFERENCES style_profiles(id) ON DELETE CASCADE,
        topic VARCHAR(255) NOT NULL,
        relevance_score INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      -- Create generated_content table
      CREATE TABLE IF NOT EXISTS generated_content (
        id UUID PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        profile_id UUID NOT NULL REFERENCES style_profiles(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        content_type VARCHAR(50) NOT NULL,
        goal VARCHAR(50) NOT NULL,
        tone VARCHAR(50) NOT NULL,
        audience VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      -- Create content_samples table
      CREATE TABLE IF NOT EXISTS content_samples (
        id UUID PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        content TEXT NOT NULL,
        content_type VARCHAR(50) NOT NULL,
        word_count INTEGER NOT NULL,
        source VARCHAR(50) NOT NULL,
        source_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      -- Add indexes for performance
      CREATE INDEX IF NOT EXISTS idx_style_profiles_user_id ON style_profiles(user_id);
      CREATE INDEX IF NOT EXISTS idx_style_insights_profile_id ON style_insights(profile_id);
      CREATE INDEX IF NOT EXISTS idx_common_phrases_profile_id ON common_phrases(profile_id);
      CREATE INDEX IF NOT EXISTS idx_topic_areas_profile_id ON topic_areas(profile_id);
      CREATE INDEX IF NOT EXISTS idx_generated_content_user_id ON generated_content(user_id);
      CREATE INDEX IF NOT EXISTS idx_generated_content_profile_id ON generated_content(profile_id);
      CREATE INDEX IF NOT EXISTS idx_content_samples_user_id ON content_samples(user_id);
    `

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
    })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to set up database",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
