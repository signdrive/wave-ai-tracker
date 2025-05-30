
// Social media sharing service
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
        await navigator.share(data);
        return true;
      } catch (error) {
        console.log('Native sharing cancelled or failed:', error);
        return false;
      }
    }
    return false;
  }

  shareToTwitter(data: ShareData): void {
    const text = encodeURIComponent(`${data.text} ${data.url}`);
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
    const text = encodeURIComponent(`${data.text} ${data.url}`);
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  }

  async shareSpotConditions(options: ShareOptions): Promise<void> {
    const ratingStars = '★'.repeat(options.rating) + '☆'.repeat(5 - options.rating);
    
    const shareData: ShareData = {
      title: 'Wave AI Tracker - Surf Conditions',
      text: `🏄‍♂️ ${options.spot} is ${options.conditions} today! ${ratingStars} Check it out on Wave AI Tracker`,
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
    // Create a simple share modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
        <h3 class="text-lg font-semibold mb-4">Share Surf Conditions</h3>
        <div class="space-y-3">
          <button onclick="window.sharingService.shareToTwitter(${JSON.stringify(data).replace(/"/g, '&quot;')})" 
                  class="w-full bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500">
            Share on Twitter
          </button>
          <button onclick="window.sharingService.shareToFacebook(${JSON.stringify(data).replace(/"/g, '&quot;')})" 
                  class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Share on Facebook
          </button>
          <button onclick="window.sharingService.shareToWhatsApp(${JSON.stringify(data).replace(/"/g, '&quot;')})" 
                  class="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Share on WhatsApp
          </button>
          <button onclick="navigator.clipboard.writeText('${data.url}'); alert('Link copied!')" 
                  class="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Copy Link
          </button>
          <button onclick="this.closest('.fixed').remove()" 
                  class="w-full border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">
            Cancel
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Make service globally available for modal buttons
    (window as any).sharingService = this;
    
    // Remove modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  copyToClipboard(text: string): void {
    navigator.clipboard?.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
    });
  }
}

export const sharingService = new SharingService();
export type { ShareData, ShareOptions };
