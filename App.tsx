
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ProposalStep } from './types';
import HeartBackground from './components/HeartBackground';
import { generateRomanticPoem } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<ProposalStep>(ProposalStep.GREETING);
  // Set initial position to the right so it's not hidden behind the YES button
  const [noButtonPos, setNoButtonPos] = useState({ x: 100, y: 0 });
  const [isCelebration, setIsCelebration] = useState(false);
  const [aiPoem, setAiPoem] = useState<string>("");
  const [isLoadingPoem, setIsLoadingPoem] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const nextStep = () => {
    if (step < ProposalStep.SUCCESS) {
      setStep((prev) => prev + 1);
    }
  };

  const handleYes = async () => {
    setIsCelebration(true);
    setStep(ProposalStep.SUCCESS);
    setIsLoadingPoem(true);
    const poem = await generateRomanticPoem("Eyad", "Awatif");
    setAiPoem(poem);
    setIsLoadingPoem(false);
  };

  const moveNoButton = useCallback(() => {
    if (!cardRef.current || !noButtonRef.current) return;

    const cardRect = cardRef.current.getBoundingClientRect();
    const btnRect = noButtonRef.current.getBoundingClientRect();

    // Calculate boundaries to keep the button within the card safely
    const padding = 40;
    const maxX = (cardRect.width / 2) - (btnRect.width / 2) - padding;
    const minX = -((cardRect.width / 2) - (btnRect.width / 2) - padding);
    const maxY = (cardRect.height / 2) - (btnRect.height / 2) - padding;
    const minY = -((cardRect.height / 2) - (btnRect.height / 2) - padding);

    // Randomize position while ensuring it jumps far enough away from current
    let randomX = Math.random() * (maxX - minX) + minX;
    let randomY = Math.random() * (maxY - minY) + minY;

    setNoButtonPos({ x: randomX, y: randomY });
  }, []);

  const renderContent = () => {
    switch (step) {
      case ProposalStep.GREETING:
        return (
          <div className="text-center space-y-8 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-romantic text-rose-600">Salam pretty girl...</h1>
            <p className="text-xl text-gray-700 italic">How are you today?</p>
            <button
              onClick={nextStep}
              className="px-10 py-3 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-all transform hover:scale-110 active:scale-95 font-semibold"
            >
              Next
            </button>
          </div>
        );
      case ProposalStep.INTEREST:
        return (
          <div className="text-center space-y-8 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-romantic text-rose-600">I am Eyad</h2>
            <p className="text-2xl text-rose-500 font-script italic">I am very interested in you...</p>
            <button
              onClick={nextStep}
              className="px-10 py-3 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-all transform hover:scale-110 active:scale-95 font-semibold"
            >
              Next
            </button>
          </div>
        );
      case ProposalStep.QUESTION:
        return (
          <div className="text-center space-y-12 animate-fadeIn relative flex flex-col items-center justify-center min-h-[350px]">
            <h2 className="text-4xl md:text-6xl font-romantic text-rose-700 drop-shadow-sm mb-12">
              Will you marry me, Awatif?
            </h2>
            
            <div className="flex items-center justify-center w-full relative h-40">
              {/* YES button is slightly to the left initially to accommodate the NO button to its right */}
              <button
                onClick={handleYes}
                className="px-12 py-4 bg-green-500 text-white rounded-full shadow-xl hover:bg-green-600 transition-all transform hover:scale-110 z-20 font-bold text-xl active:scale-90 -translate-x-16 md:-translate-x-20"
              >
                YES!
              </button>

              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${noButtonPos.x}px), calc(-50% + ${noButtonPos.y}px))`,
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  zIndex: 10,
                }}
              >
                <button
                  ref={noButtonRef}
                  onMouseEnter={moveNoButton}
                  onPointerEnter={moveNoButton}
                  onClick={(e) => { e.preventDefault(); moveNoButton(); }}
                  className="px-8 py-3 bg-gray-400 text-white rounded-full shadow-md cursor-default select-none animate-wiggle opacity-95 border-2 border-white/20 whitespace-nowrap"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        );
      case ProposalStep.SUCCESS:
        return (
          <div className="text-center space-y-8 animate-popIn">
            <div className="text-6xl mb-4">💍✨❤️</div>
            <h1 className="text-5xl font-romantic text-rose-600">She said YES!</h1>
            <p className="text-xl text-gray-700 italic">Eyad & Awatif, Forever.</p>
            
            <div className="bg-white/60 p-6 rounded-2xl shadow-inner border border-rose-100 max-w-md mx-auto mt-8">
              {isLoadingPoem ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              ) : (
                <p className="text-xl font-script text-rose-800 leading-relaxed">
                  "{aiPoem}"
                </p>
              )}
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="text-sm text-rose-400 hover:text-rose-600 underline mt-4"
            >
              Relive the moment
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-pink-100 to-rose-50 relative overflow-hidden">
      <HeartBackground />
      
      {/* Decorative SVG Petals */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="10" cy="10" r="2" fill="pink" />
          <circle cx="90" cy="80" r="3" fill="rose" />
          <circle cx="20" cy="70" r="1.5" fill="pink" />
        </svg>
      </div>

      <div 
        ref={cardRef}
        className={`relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl p-8 md:p-16 border border-white/50 transition-all duration-700 ${isCelebration ? 'bg-white/90 ring-8 ring-rose-200' : ''}`}
      >
        {/* Floating Rings Emoji Decoration */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-full p-4 shadow-lg border-2 border-rose-200">
           <span className="text-4xl">❤️</span>
        </div>

        {renderContent()}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.9); }
          70% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg) translateX(-2px); }
          50% { transform: rotate(3deg) translateX(2px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-popIn {
          animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-wiggle {
          animation: wiggle 0.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
