import os
import json
import boto3 # type: ignore
from openai import OpenAI # type: ignore
from dotenv import load_dotenv # type: ignore

load_dotenv()

# Example usage:
# messages = [
#     {"role": "user", "message": "Hello, how are you?"},
#     {"role": "assistant", "message": "I'm fine, thank you."},
#     {"role": "user", "message": "What's the weather like today?"}
# ]
# handler = LLMHandler('claude')
# response = handler.send_message(messages)
# print(response)

class LLMHandler:
    def __init__(self, model):
        self.model = model.lower()
        
        self.model_apis = {
            'gpt': self._gpt_api,
            'llama': self._llama_api,
            'claude': self._claude_api
        }
        
        if self.model not in self.model_apis:
            raise ValueError("Unsupported model. Choose from 'gpt', 'llama', or 'claude'.")

        # self.gpt_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        
        self.llama_client = boto3.client(service_name="bedrock-runtime", region_name="us-east-1")
        self.llama_model_id = "meta.llama3-8b-instruct-v1:0"
        
        self.claude_client = boto3.client(service_name="bedrock-runtime", region_name="us-east-1")
        self.claude_model_id = "anthropic.claude-3-sonnet-20240229-v1:0"

    def send_message(self, messages):
        formatted_messages = self._format_messages(messages)
        response = self.model_apis[self.model](formatted_messages)
        return response
    
    def _format_messages(self, messages):
        if self.model == 'gpt':
            return self._format_for_gpt(messages)
        elif self.model == 'llama':
            return self._format_for_llama(messages)
        elif self.model == 'claude':
            return self._format_for_claude(messages)
    
    def _format_for_gpt(self, messages):
        formatted_messages = []
        for m in messages:
            formatted_messages.append({
                "role": m["role"],
                "content": m["message"]
            })
        return formatted_messages
    
    def _format_for_llama(self, messages):
        prompt = f"""
        <|begin_of_text|>
        """
        for m in messages:
            prompt += f"""
            <|start_header_id|>{m["role"]}<|end_header_id|>
            {m["message"]}
            <|eot_id|>
            """
        prompt += """
        <|start_header_id|>assistant<|end_header_id|>
        """
        return prompt
    
    def _format_for_claude(self, messages):
        formatted_messages = []
        for m in messages:
            formatted_messages.append({
                "role": m["role"],
                "content": [{"type": "text", "text": m["message"]}]
            })
        return formatted_messages
    
    def _gpt_api(self, formatted_messages):
        response = self.gpt_client.chat.completions.create(
            model="gpt-4o",
            messages=formatted_messages,
        )
        return response.choices[0].message.content
    
    def _llama_api(self, formatted_messages):
        response = self.llama_client.invoke_model(
            body=json.dumps({"prompt": formatted_messages}),
            modelId=self.llama_model_id
        )

        model_response = json.loads(response["body"].read())
        response_text = model_response["generation"]
        return response_text
    
    def _claude_api(self, formatted_messages):
        response = self.claude_client.invoke_model(
                modelId=self.claude_model_id,
                body=json.dumps(
                    {
                        "anthropic_version": "bedrock-2023-05-31",
                        "max_tokens": 4096,
                        "messages": formatted_messages,
                    }
                ),
            )
        result = json.loads(response.get("body").read())
        output_list = result.get("content", [])
        response = ""
        for output in output_list:
            response += output["text"]
        return response
