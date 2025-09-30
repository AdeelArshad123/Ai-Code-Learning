import { supabase } from '../lib/supabase';

export interface CodeGeneration {
  id?: string;
  user_id: string;
  prompt: string;
  language: string;
  generated_code: string;
  explanation: string;
  is_bookmarked: boolean;
  created_at?: string;
}

export const codeGenService = {
  async generateCode(prompt: string, language: string): Promise<{ code: string; explanation: string }> {
    const languageExamples: Record<string, { template: string; example: string }> = {
      python: {
        template: 'def',
        example: `def example_function(param1, param2):
    """
    ${prompt}

    Args:
        param1: First parameter
        param2: Second parameter

    Returns:
        Result of the operation
    """
    result = param1 + param2
    return result

if __name__ == "__main__":
    print(example_function(5, 10))`,
      },
      javascript: {
        template: 'function',
        example: `/**
 * ${prompt}
 * @param {*} param1 - First parameter
 * @param {*} param2 - Second parameter
 * @returns {*} Result of the operation
 */
function exampleFunction(param1, param2) {
  const result = param1 + param2;
  return result;
}

console.log(exampleFunction(5, 10));`,
      },
      java: {
        template: 'class',
        example: `/**
 * ${prompt}
 */
public class Example {
    public static void main(String[] args) {
        int result = exampleMethod(5, 10);
        System.out.println(result);
    }

    public static int exampleMethod(int param1, int param2) {
        return param1 + param2;
    }
}`,
      },
      cpp: {
        template: 'function',
        example: `#include <iostream>
using namespace std;

/**
 * ${prompt}
 */
int exampleFunction(int param1, int param2) {
    return param1 + param2;
}

int main() {
    cout << exampleFunction(5, 10) << endl;
    return 0;
}`,
      },
    };

    const langTemplate = languageExamples[language.toLowerCase()] || languageExamples.javascript;

    return {
      code: langTemplate.example,
      explanation: `This is a generated ${language} code example based on your prompt: "${prompt}". The code demonstrates a basic implementation pattern. For production use, integrate with OpenAI API or similar service.`,
    };
  },

  async saveGeneration(generation: CodeGeneration) {
    const { data, error } = await supabase
      .from('code_generations')
      .insert(generation)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserGenerations(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from('code_generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as CodeGeneration[];
  },

  async toggleBookmark(generationId: string, isBookmarked: boolean) {
    const { error } = await supabase
      .from('code_generations')
      .update({ is_bookmarked: isBookmarked })
      .eq('id', generationId);

    if (error) throw error;
  },

  async deleteGeneration(generationId: string) {
    const { error } = await supabase
      .from('code_generations')
      .delete()
      .eq('id', generationId);

    if (error) throw error;
  },
};
