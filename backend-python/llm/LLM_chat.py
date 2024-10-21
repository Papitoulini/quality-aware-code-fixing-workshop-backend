from LLM import LLMHandler

# Example usage:
# chat_handler = LLMChatHandler('claude')
# response = chat_handler.send_message("Hi, my name is John. What's your name?")
# print(response)
# response = chat_handler.send_message("I'm a software developer. What do you do?")
# print(response)
# response = chat_handler.send_message("What's my name?")
# print(response)

class LLMChatHandler:
    def __init__(self, model):
        self.model = model.lower()
        
        if self.model not in ['gpt', 'llama', 'claude']:
            raise ValueError("Unsupported model. Choose from 'gpt', 'llama', or 'claude'.")

        self.LLMHandler = LLMHandler(self.model)
        self.messages = []
    
    def send_message(self, message):
        self.messages.append({"role": "user", "message": message})
        response = self.LLMHandler.send_message(self.messages)
        self.messages.append({"role": "assistant", "message": response})
        return response

chat_handler = LLMChatHandler('claude')
response = chat_handler.send_message("Hi, my name is John. What's your name?")
print(response)
response = chat_handler.send_message("I'm a software developer. What do you do?")
print(response)
response = chat_handler.send_message("What's my name?")
print(response)
