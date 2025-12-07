import { StringUtil } from '@utils';

class SlugEncoderUtil {
  /**
   * Generate slug: readable-text-123456
   *
   * @param text - Title to slugify
   * @returns Slug like "taylor-swift-483920"
   */
  static generateSlug(text: string): string {
    const readable = StringUtil.slugify(text);
    const randomCode = this.random6Digits();
    return `${readable}-${randomCode}`;
  }

  /**
   * Generate random 6-digit string (000000–999999)
   */
  private static random6Digits(): string {
    return Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, '0');
  }

  /**
   * Get readable part from slug
   * "hello-world-483920" → "hello-world"
   * If slug no suffix → return slug
   */
  static getReadablePart(slug: string): string {
    if (!slug) return '';

    const parts = slug.split('-');
    const last = parts[parts.length - 1];

    // Nếu phần cuối là 6 chữ số → bỏ nó
    if (/^\d{6}$/.test(last)) {
      return parts.slice(0, -1).join('-');
    }

    return slug;
  }

  /**
   * Validate slug format
   * Ví dụ: "hello-world-483920"
   */
  static isValidSlug(slug: string): boolean {
    if (!slug) return false;

    const parts = slug.split('-');
    const last = parts[parts.length - 1];

    return /^\d{6}$/.test(last);
  }
}
export { SlugEncoderUtil };
