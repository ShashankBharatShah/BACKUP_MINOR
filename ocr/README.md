# Image to Text OCR Converter

This Python script uses Tesseract OCR to convert images to text. It supports various image formats including PNG, JPEG, TIFF, and BMP.

## Prerequisites

1. Install Tesseract OCR on your system:
   - Windows: Download and install from [Tesseract GitHub Releases](https://github.com/UB-Mannheim/tesseract/wiki)
   - Linux: `sudo apt-get install tesseract-ocr`
   - macOS: `brew install tesseract`

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. Place your image files in the `images` directory
2. Run the script:
   ```bash
   python ocr_script.py
   ```
3. The script will process all supported image files in the `images` directory and display the extracted text

## Supported Image Formats

- PNG (.png)
- JPEG (.jpg, .jpeg)
- TIFF (.tiff)
- BMP (.bmp)

## Notes

- For best results, use clear, high-quality images with good contrast
- The text should be clearly visible and not distorted
- Processing time may vary depending on image size and complexity 