import pytesseract
from PIL import Image
import os
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Download required NLTK data
try:
    nltk.data.find('vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

# Configure Tesseract path
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Configure upload folder
UPLOAD_FOLDER = 'images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'tiff', 'bmp'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_sentiment(text):
    """
    Analyze the sentiment and emotions in the given text
    """
    sia = SentimentIntensityAnalyzer()
    sentiment_scores = sia.polarity_scores(text)
    
    # Determine the overall sentiment
    if sentiment_scores['compound'] >= 0.05:
        sentiment = 'Positive'
    elif sentiment_scores['compound'] <= -0.05:
        sentiment = 'Negative'
    else:
        sentiment = 'Neutral'
    
    # Analyze emotional intensity
    emotional_intensity = 'Low'
    if abs(sentiment_scores['compound']) > 0.5:
        emotional_intensity = 'High'
    elif abs(sentiment_scores['compound']) > 0.2:
        emotional_intensity = 'Medium'
    
    # Analyze specific emotions based on compound score
    emotions = []
    if sentiment_scores['compound'] > 0:
        if sentiment_scores['compound'] > 0.5:
            emotions.append('Very Happy')
        elif sentiment_scores['compound'] > 0.2:
            emotions.append('Happy')
        else:
            emotions.append('Slightly Positive')
    elif sentiment_scores['compound'] < 0:
        if sentiment_scores['compound'] < -0.5:
            emotions.append('Very Sad')
        elif sentiment_scores['compound'] < -0.2:
            emotions.append('Sad')
        else:
            emotions.append('Slightly Negative')
    
    # Analyze text complexity and emotional depth
    words = text.split()
    emotional_depth = 'Basic'
    if len(words) > 50:
        emotional_depth = 'Complex'
    elif len(words) > 20:
        emotional_depth = 'Moderate'
    
    # Create detailed emotional analysis
    emotional_analysis = {
        'overall_sentiment': sentiment,
        'emotional_intensity': emotional_intensity,
        'primary_emotions': emotions,
        'emotional_depth': emotional_depth,
        'sentiment_scores': sentiment_scores,
        'text_length': len(words),
        'emotional_indicators': {
            'positive_words': sentiment_scores['pos'],
            'negative_words': sentiment_scores['neg'],
            'neutral_words': sentiment_scores['neu'],
            'compound_score': sentiment_scores['compound']
        }
    }
    
    return emotional_analysis

def image_to_text(image_path):
    """
    Convert image to text using Tesseract OCR
    """
    try:
        # Open the image
        img = Image.open(image_path)
        
        # Extract text from the image
        text = pytesseract.image_to_string(img)
        
        return text.strip()
    except Exception as e:
        return f"Error processing image: {str(e)}"

@app.route('/api/ocr', methods=['POST'])
def ocr_endpoint():
    """
    Endpoint to process image and return OCR text with emotional analysis
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Extract text from image
            text = image_to_text(filepath)
            
            # Analyze emotions if text was successfully extracted
            if not text.startswith("Error processing image"):
                emotional_analysis = analyze_sentiment(text)
                response = {
                    'text': text,
                    'emotional_analysis': emotional_analysis
                }
            else:
                response = {
                    'error': text
                }
            
            # Clean up the uploaded file
            os.remove(filepath)
            
            return jsonify(response)
            
        except Exception as e:
            # Clean up the file in case of error
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({'status': 'healthy'})

@app.route('/api/process-directory', methods=['GET'])
def process_directory():
    """
    Process all images in the images directory
    """
    results = []
    
    # Process all images in the images directory
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            
            # Extract text from image
            text = image_to_text(image_path)
            
            # Analyze sentiment if text was successfully extracted
            if not text.startswith("Error processing image"):
                sentiment, scores = analyze_sentiment(text)
                results.append({
                    'filename': filename,
                    'text': text,
                    'sentiment': sentiment,
                    'sentiment_scores': scores
                })
            else:
                results.append({
                    'filename': filename,
                    'error': text
                })
    
    return jsonify(results)

if __name__ == "__main__":
    print("Starting OCR API server...")
    print("Make sure Tesseract OCR is installed at:", pytesseract.pytesseract.tesseract_cmd)
    app.run(host='0.0.0.0', port=5001, debug=True) 