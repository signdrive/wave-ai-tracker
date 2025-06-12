
// Social media sharing service with XSS protection
import { InputValidator } from '@/utils/inputValidator';

interface ShareData {
  title: string;
  text: string;
  url: string;
  image?: string;
}

interface ShareOptions {
  spot: string;
  conditions: string;
  rating: number;
  image?: string;
}

class SharingService {
  async shareToNative(data: ShareData): Promise<boolean> {
    if (navigator.share) {
      try {
        // Sanitize data before sharing
        const sanitizedData = {
          title: InputValidator.sanitizeString(data.title),
          text: InputValidator.sanitizeString(data.text),
          url: data.url // URLs are validated separately
        };
        
        await navigator.share(sanitizedData);
        return true;
      } catch (error) {
        console.log('Native sharing cancelled or failed:', error);
        return false;
      }
    }
    return false;
  }

  shareToTwitter(data: ShareData): void {
    const sanitizedText = InputValidator.sanitizeString(data.text);
    const text = encodeURIComponent(`${sanitizedText} ${data.url}`);
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank', 'width=550,height=420');
  }

  shareToFacebook(data: ShareData): void {
    const url = encodeURIComponent(data.url);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(shareUrl, '_blank', 'width=580,height=296');
  }

  shareToInstagram(image: string): void {
    // Instagram doesn't have direct web sharing, but we can copy the image URL
    navigator.clipboard?.writeText(image);
    alert('Image URL copied! You can now paste it in Instagram.');
  }

  shareToWhatsApp(data: ShareData): void {
    const sanitizedText = InputValidator.sanitizeString(data.text);
    const text = encodeURIComponent(`${sanitizedText} ${data.url}`);
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  }

  async shareSpotConditions(options: ShareOptions): Promise<void> {
    const ratingStars = '★'.repeat(Math.max(0, Math.min(5, options.rating))) + 
                       '☆'.repeat(Math.max(0, 5 - Math.max(0, Math.min(5, options.rating))));
    
    const sanitizedSpot = InputValidator.sanitizeString(options.spot);
    const sanitizedConditions = InputValidator.sanitizeString(options.conditions);
    
    const shareData: ShareData = {
      title: 'Wave AI Tracker - Surf Conditions',
      text: `🏄‍♂️ ${sanitizedSpot} is ${sanitizedConditions} today! ${ratingStars} Check it out on Wave AI Tracker`,
      url: window.location.href,
      image: options.image
    };

    // Try native sharing first
    const nativeShared = await this.shareToNative(shareData);
    
    if (!nativeShared) {
      // Fallback to custom share modal
      this.showShareModal(shareData);
    }
  }

  private showShareModal(data: ShareData): void {
    // Create a secure share modal using DOM manipulation instead of innerHTML
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-lg p-6 max-w-sm mx-4';
    
    const title = document.createElement('h3');
    title.className = 'text-lg font-semibold mb-4';
    title.textContent = 'Share Surf Conditions';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'space-y-3';
    
    // Create buttons safely
    const buttons = [
      { text: 'Share on Twitter', action: () => this.shareToTwitter(data), class: 'bg-blue-400 hover:bg-blue-500' },
      { text: 'Share on Facebook', action: () => this.shareToFacebook(data), class: 'bg-blue-600 hover:bg-blue-700' },
      { text: 'Share on WhatsApp', action: () => this.shareToWhatsApp(data), class: 'bg-green-500 hover:bg-green-600' },
      { text: 'Copy Link', action: () => this.copyToClipboard(data.url), class: 'bg-gray-500 hover:bg-gray-600' },
      { text: 'Cancel', action: () => modal.remove(), class: 'border border-gray-300 hover:bg-gray-100' }
    ];
    
    buttons.forEach(buttonConfig => {
      const button = document.createElement('button');
      button.className = `w-full text-white px-4 py-2 rounded ${buttonConfig.class}`;
      button.textContent = buttonConfig.text;
      button.addEventListener('click', () => {
        buttonConfig.action();
        if (buttonConfig.text !== 'Cancel') {
          modal.remove();
        }
      });
      buttonContainer.appendChild(button);
    });
    
    modalContent.appendChild(title);
    modalContent.appendChild(buttonContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Remove modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  copyToClipboard(text: string): void {
    navigator.clipboard?.writeText(text).then(() => {
      // Create a temporary toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
      toast.textContent = 'Link copied to clipboard!';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }).catch(() => {
      console.error('Failed to copy to clipboard');
    });
  }
}

export const sharingService = new SharingService();
export type { ShareData, ShareOptions };
