import React, { useState, useRef } from 'react';
import { X, Sparkles, Loader2, FileText, Image as ImageIcon, Upload, RefreshCw } from 'lucide-react';
import { parseCoursesFromData } from '../services/aiService';
import { Course } from '../types';

interface AiImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (courses: Course[]) => void;
}

type InputType = 'text' | 'image';

const AiImportModal: React.FC<AiImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [inputStep, setInputStep] = useState(0); // 0: input, 1: loading
  const [inputType, setInputType] = useState<InputType>('text');
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImport = async () => {
    if (inputType === 'text' && !inputText.trim()) return;
    if (inputType === 'image' && !selectedImage) return;
    
    setInputStep(1);
    setError(null);
    
    try {
      const data = inputType === 'text' ? inputText : selectedImage!;
      const courses = await parseCoursesFromData(data, inputType);
      
      if (courses.length === 0) {
        throw new Error("هیچ درسی یافت نشد. لطفا ورودی را بررسی کنید.");
      }

      onImport(courses);
      onClose();
      // Reset state after close
      setTimeout(() => {
        setInputStep(0);
        setInputText('');
        setSelectedImage(null);
      }, 300);
    } catch (err) {
      console.error(err);
      setError('مشکلی در پردازش پیش آمد. لطفا مطمئن شوید متن یا تصویر واضح است.');
      setInputStep(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-l from-indigo-600 to-violet-600 p-6 flex justify-between items-center text-white">
          <div className="flex items-center">
            <Sparkles className="ml-3" />
            <h2 className="text-xl font-bold">ورود هوشمند دروس</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs (Only visible in step 0) */}
        {inputStep === 0 && (
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setInputType('text')}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center transition-colors ${
                inputType === 'text' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText size={18} className="ml-2" />
              ورود متنی
            </button>
            <button
              onClick={() => setInputType('image')}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center transition-colors ${
                inputType === 'image' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ImageIcon size={18} className="ml-2" />
              آپلود تصویر (اسکرین‌شات)
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {inputStep === 0 ? (
            <div className="space-y-4 h-full">
              
              {inputType === 'text' ? (
                <>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
                    <FileText className="text-blue-600 ml-3 mt-1 flex-shrink-0" size={20} />
                    <p className="text-sm text-blue-800 leading-relaxed">
                      متن لیست دروس ارائه شده یا برنامه هفتگی خود را از سایت دانشگاه کپی کنید و در کادر زیر قرار دهید.
                    </p>
                  </div>
                  <textarea
                    className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm font-mono leading-relaxed resize-none"
                    placeholder="اینجا Paste کنید..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    dir="auto"
                  ></textarea>
                </>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start mb-4">
                    <ImageIcon className="text-blue-600 ml-3 mt-1 flex-shrink-0" size={20} />
                    <p className="text-sm text-blue-800 leading-relaxed">
                      یک اسکرین‌شات واضح از جدول دروس خود آپلود کنید. هوش مصنوعی آن را می‌خواند.
                    </p>
                  </div>
                  
                  <div 
                    className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer ${
                      selectedImage ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    
                    {selectedImage ? (
                      <div className="relative w-full h-full flex flex-col items-center">
                        <img src={selectedImage} alt="Preview" className="max-h-64 rounded-lg shadow-md object-contain" />
                        <button 
                          className="mt-4 flex items-center text-sm text-indigo-600 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                        >
                          <RefreshCw size={14} className="ml-1" />
                          تغییر تصویر
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                           <Upload className="text-indigo-500" size={32} />
                        </div>
                        <p className="text-gray-700 font-medium mb-1">برای انتخاب عکس کلیک کنید</p>
                        <p className="text-gray-400 text-sm">PNG, JPG</p>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 h-full">
              <Loader2 className="animate-spin text-indigo-600" size={48} />
              <p className="text-gray-600 font-medium animate-pulse">در حال تحلیل {inputType === 'text' ? 'متن' : 'تصویر'} با هوش مصنوعی...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {inputStep === 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200 font-medium transition-colors"
            >
              انصراف
            </button>
            <button 
              onClick={handleImport}
              disabled={inputType === 'text' ? !inputText.trim() : !selectedImage}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Sparkles size={18} className="ml-2" />
              پردازش و افزودن
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiImportModal;