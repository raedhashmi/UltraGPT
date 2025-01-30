import google.generativeai as genai
import PIL.Image

api_key=open('./GOOGLE_API_KEY.txt').read()
genai.configure(api_key=api_key)

def AI(prompt, img=None):
    if img != None:
        PIL.Image.SAVE('{img}')
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content([prompt, img])
        return response.text
    else:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        return response.text

print(AI(input("Ask: ")), 'img.png')