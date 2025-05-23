# UltraGPT

UltraGPT is a simple AI-powered interface that allows users to interact with an AI model using Flask and LangChain.

## Installation

To set up UltraGPT, install the required dependencies using the following commands:

```sh
pip install -r .\requirements.txt
```

## Setup

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey?utm_source=colab.research.google.com&utm_medium=referral&utm_campaign=colab-integration&utm_content=owned-promo) and create an account if you haven't already.
2. Generate a new API key.
3. Copy your API key and paste it into a file named `GOOGLE_API_KEY.txt` in the project directory.

## Running the Application

Start the Flask app using one of the following commands:

For Windows:
```sh
py index.py
```

For Linux/macOS:
```sh
python index.py
```

## API Key Management

If `GOOGLE_API_KEY.txt` does not contain a valid API key, the application will prompt an error message and ask you to obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey?utm_source=colab.research.google.com&utm_medium=referral&utm_campaign=colab-integration&utm_content=owned-promo). After adding the key, restart the Flask app for the changes to take effect.

## Running the EXE

If you are unable to run `UltraGPT.py` or clone this project, you can individually run `UltraGPT.exe` in `output` to open the app. Note that this executable will not need the libraries or python installed but will run independently without any dependencies