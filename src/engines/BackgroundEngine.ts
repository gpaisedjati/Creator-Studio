export class BackgroundEngine {
  private static backgrounds: Record<string, string> = {
    '25 nabi dan rasul': '25-nabi-dan-rasul.png',
    'sirah nabawiyah': 'sirah-nabawiyah.png',
    'aqidah islam': 'aqidah-islam.png',
    'akhlak islami': 'akhlak-islami.png',
    'fiqih ibadah': 'fiqih-ibadah.png',
    'shalat': 'shalat.png',
    'zakat': 'zakat.png',
    'puasa ramadan': 'puasa-ramadan.png',
    'haji dan umrah': 'haji-dan-umrah.png',
    'al quran': 'al-quran.png',
    'tajwid': 'tajwid.png',
    'asmaul husna': 'asmaul-husna.png',
    'hadits pilihan': 'hadits-pilihan.png',
    'doa dalam islam': 'doa-dalam-islam.png',
    'sejarah islam': 'sejarah-islam.png',
    'khulafaur rasyidin': 'khulafaur-rasyidin.png',
    'sahabat nabi': 'sahabat-nabi.png',
    'kisah wanita mulia': 'kisah-wanita-mulia.png',
    'hari besar islam': 'hari-besar-islam.png',
    'masjid bersejarah': 'masjid-bersejarah.png',
    'tokoh islam dunia': 'tokoh-islam-dunia.png'
  };

  public static getBackgroundUrl(topic: string): string | null {
    if (!topic) return null;
    
    const normalizedTopic = topic
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
      
    // Exact match
    if (this.backgrounds[normalizedTopic]) {
      return `/backgrounds/${this.backgrounds[normalizedTopic]}`;
    }
    
    // Partial match
    for (const [key, filename] of Object.entries(this.backgrounds)) {
      if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
        return `/backgrounds/${filename}`;
      }
    }
    
    // Fallback based on slugification
    const slug = topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
      
    return `/backgrounds/${slug}.png`; 
  }
  
  public static preloadImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(false);
        return;
      }
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  }
}
