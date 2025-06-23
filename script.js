// Enhanced Calculator JavaScript with improved UX

class PriceCalculator {
    constructor() {
        this.priceInput = document.getElementById("price2");
        this.calculateBtn = document.getElementById("calculateBtn");
        this.resultAED = document.getElementById("result2");
        this.resultUSD = document.getElementById("result3");
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupRealTimeCalculation();
        this.addLoadingAnimation();
    }

    setupEventListeners() {
        // Enter key calculation
        this.priceInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.calculate();
            }
        });

        // Button click calculation
        this.calculateBtn.addEventListener("click", () => {
            this.calculate();
        });

        // Input validation and formatting
        this.priceInput.addEventListener("input", (event) => {
            this.validateInput(event);
            this.realTimeCalculate();
        });

        // Focus and blur effects
        this.priceInput.addEventListener("focus", () => {
            this.priceInput.parentElement.style.transform = "scale(1.02)";
        });

        this.priceInput.addEventListener("blur", () => {
            this.priceInput.parentElement.style.transform = "scale(1)";
        });
    }

    setupRealTimeCalculation() {
        // Real-time calculation as user types
        let timeout;
        this.priceInput.addEventListener("input", () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (this.priceInput.value && this.priceInput.value > 0) {
                    this.calculate(true); // Silent calculation without animations
                }
            }, 500);
        });
    }

    validateInput(event) {
        const value = event.target.value;
        
        // Remove any non-numeric characters except decimal point
        const cleanValue = value.replace(/[^0-9.]/g, '');
        
        // Ensure only one decimal point
        const parts = cleanValue.split('.');
        if (parts.length > 2) {
            event.target.value = parts[0] + '.' + parts.slice(1).join('');
        } else {
            event.target.value = cleanValue;
        }

        // Limit decimal places to 2
        if (parts[1] && parts[1].length > 2) {
            event.target.value = parts[0] + '.' + parts[1].substring(0, 2);
        }
    }

    calculate(silent = false) {
        const price = parseFloat(this.priceInput.value);
        
        if (isNaN(price) || price <= 0) {
            this.showError("الرجاء إدخال رقم صالح أكبر من الصفر");
            return;
        }

        if (!silent) {
            this.showLoading();
        }

        // Simulate calculation delay for better UX
        setTimeout(() => {
            // BITBOX and bitedit calculations
            const aedResult = price * 1.1 * 3.68;
            const usdResult = price * 1.1;

            this.displayResults(aedResult, usdResult, silent);
            
            if (!silent) {
                this.addSuccessAnimation();
                this.addCalculationSound();
            }
        }, silent ? 0 : 800);
    }

    showLoading() {
        this.resultAED.textContent = "جاري الحساب...";
        this.resultUSD.textContent = "جاري الحساب...";
        
        this.resultAED.classList.add("result-loading");
        this.resultUSD.classList.add("result-loading");
        
        this.calculateBtn.disabled = true;
        this.calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحساب...';
    }

    displayResults(aedResult, usdResult, silent = false) {
        // Format numbers with proper Arabic locale
        const formattedAED = this.formatCurrency(aedResult, 'AED');
        const formattedUSD = this.formatCurrency(usdResult, 'USD');

        this.resultAED.textContent = formattedAED;
        this.resultUSD.textContent = formattedUSD;

        // Remove loading state
        this.resultAED.classList.remove("result-loading");
        this.resultUSD.classList.remove("result-loading");
        
        this.calculateBtn.disabled = false;
        this.calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> احسب النتيجة';

        if (!silent) {
            // Add success animation
            this.resultAED.classList.add("result-success");
            this.resultUSD.classList.add("result-success");
            
            setTimeout(() => {
                this.resultAED.classList.remove("result-success");
                this.resultUSD.classList.remove("result-success");
            }, 600);
        }
    }

    formatCurrency(amount, currency) {
        const formatted = new Intl.NumberFormat('ar-AE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
        
        return `${formatted} ${currency}`;
    }

    showError(message) {
        this.resultAED.textContent = message;
        this.resultUSD.textContent = "";
        
        this.resultAED.style.color = "#e74c3c";
        this.resultUSD.style.color = "#e74c3c";
        
        // Reset color after 3 seconds
        setTimeout(() => {
            this.resultAED.style.color = "";
            this.resultUSD.style.color = "";
        }, 3000);

        // Shake animation for error
        this.priceInput.style.animation = "shake 0.5s ease-in-out";
        setTimeout(() => {
            this.priceInput.style.animation = "";
        }, 500);
    }

    addSuccessAnimation() {
        // Create success particles effect
        this.createParticles();
        
        // Pulse effect for calculate button
        this.calculateBtn.style.animation = "successPulse 0.6s ease-out";
        setTimeout(() => {
            this.calculateBtn.style.animation = "";
        }, 600);
    }

    createParticles() {
        const container = document.querySelector('.calculator-card.active');
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: particle-float 2s ease-out forwards;
                left: ${Math.random() * 100}%;
                top: 50%;
            `;
            
            container.style.position = 'relative';
            container.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    }

    addCalculationSound() {
        // Create audio context for calculation sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Audio not supported, continue silently
        }
    }

    addLoadingAnimation() {
        // Add CSS for additional animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            @keyframes particle-float {
                0% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-100px) scale(0);
                }
            }
            
            .calculate-btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    realTimeCalculate() {
        const price = parseFloat(this.priceInput.value);
        
        if (!isNaN(price) && price > 0) {
            const aedResult = price * 1.1 * 3.68;
            const usdResult = price * 1.1;
            
            this.displayResults(aedResult, usdResult, true);
        } else {
            this.resultAED.textContent = "0.00 AED";
            this.resultUSD.textContent = "0.00 USD";
        }
    }
}

// Utility functions for enhanced UX
class UIEnhancements {
    static init() {
        this.addScrollAnimations();
        this.addThemeToggle();
        this.addKeyboardShortcuts();
        this.addTooltips();
    }

    static addScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = "fadeInUp 0.8s ease-out";
                }
            });
        });

        document.querySelectorAll('.calculator-card').forEach(card => {
            observer.observe(card);
        });
    }

    static addThemeToggle() {
        // Add theme toggle button (optional enhancement)
        const themeToggle = document.createElement('button');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.className = 'theme-toggle';
        themeToggle.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        document.body.appendChild(themeToggle);
    }

    static addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter for quick calculation
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('calculateBtn').click();
            }
            
            // Escape to clear input
            if (e.key === 'Escape') {
                document.getElementById('price2').value = '';
                document.getElementById('price2').focus();
            }
        });
    }

    static addTooltips() {
        // Add helpful tooltips
        const tooltips = [
            { element: '#price2', text: 'اضغط Enter للحساب السريع' },
            { element: '#calculateBtn', text: 'أو استخدم Ctrl+Enter' }
        ];

        tooltips.forEach(tooltip => {
            const element = document.querySelector(tooltip.element);
            if (element) {
                element.title = tooltip.text;
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize calculator
    const calculator = new PriceCalculator();
    
    // Initialize UI enhancements
    UIEnhancements.init();
    
    // Add welcome animation
    setTimeout(() => {
        document.querySelector('.header').style.animation = "fadeInDown 0.8s ease-out";
    }, 200);
    
    // Focus on input for immediate use
    setTimeout(() => {
        document.getElementById('price2').focus();
    }, 1000);
});

// Add service worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration would go here
        console.log('Calculator ready for offline use');
    });
}

