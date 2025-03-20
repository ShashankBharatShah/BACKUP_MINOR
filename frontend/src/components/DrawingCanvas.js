import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Slider,
  Typography,
  Button,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import {
  Brush,
  Palette,
  Undo,
  Redo,
  Clear,
  Save,
  Delete,
  ColorLens
} from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import styled from '@emotion/styled';

const CanvasContainer = styled(Paper)`
  position: relative;
  width: 100%;
  height: 400px;
  background: ${props => props.theme.palette.background.paper};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px ${props => alpha(props.theme.palette.common.black, 0.1)};
`;

const Toolbar = styled(Box)`
  position: absolute;
  top: 16px;
  left: 16px;
  background: ${props => alpha(props.theme.palette.background.paper, 0.9)};
  padding: 8px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 8px ${props => alpha(props.theme.palette.common.black, 0.1)};
  backdrop-filter: blur(8px);
`;

const ColorPickerContainer = styled(Box)`
  position: absolute;
  top: 16px;
  right: 16px;
  background: ${props => alpha(props.theme.palette.background.paper, 0.9)};
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 8px ${props => alpha(props.theme.palette.common.black, 0.1)};
  backdrop-filter: blur(8px);
`;

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const theme = useTheme();
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [context, setContext] = useState(null);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    setContext(ctx);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastPos({ x, y });
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    if (isDrawing) {
      context.closePath();
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const saveToHistory = () => {
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push(canvasRef.current.toDataURL());
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  const undo = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      loadImage(history[newStep]);
    }
  };

  const redo = () => {
    if (currentStep < history.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      loadImage(history[newStep]);
    }
  };

  const loadImage = (dataUrl) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.drawImage(img, 0, 0);
    };
  };

  const clearCanvas = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveToHistory();
  };

  const saveDrawing = () => {
    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Express Yourself Through Art
      </Typography>
      <CanvasContainer>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
        />
        
        <Toolbar>
          <Tooltip title="Brush">
            <IconButton>
              <Brush />
            </IconButton>
          </Tooltip>
          <Tooltip title="Color">
            <IconButton onClick={() => setShowColorPicker(!showColorPicker)}>
              <Palette />
            </IconButton>
          </Tooltip>
          <Tooltip title="Undo">
            <IconButton onClick={undo} disabled={currentStep <= 0}>
              <Undo />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo">
            <IconButton onClick={redo} disabled={currentStep >= history.length - 1}>
              <Redo />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear">
            <IconButton onClick={clearCanvas}>
              <Clear />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save">
            <IconButton onClick={saveDrawing}>
              <Save />
            </IconButton>
          </Tooltip>
        </Toolbar>

        <ColorPickerContainer>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
              Brush Size
            </Typography>
            <Slider
              value={brushSize}
              onChange={(e, newValue) => {
                setBrushSize(newValue);
                context.lineWidth = newValue;
              }}
              min={1}
              max={20}
              size="small"
              orientation="vertical"
              sx={{ height: 100 }}
            />
          </Box>
          {showColorPicker && (
            <ChromePicker
              color={color}
              onChange={(color) => {
                setColor(color.hex);
                context.strokeStyle = color.hex;
                setShowColorPicker(false);
              }}
              disableAlpha
            />
          )}
        </ColorPickerContainer>
      </CanvasContainer>
    </Box>
  );
};

export default DrawingCanvas;
