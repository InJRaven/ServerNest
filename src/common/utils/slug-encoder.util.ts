import { StringUtil } from '@utils';

class SlugEncoderUtil {
  private static readonly BASE62_CHARS =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private static readonly BASE62_LENGTH = 62n;
  private static readonly ENCODED_LENGTH = 8;

  /**
   * Generate slug: readable-text-{encodedId}
   *
   * @param text - Title or name to slugify
   * @param id - UUID to encode
   * @returns Slug like "taylor-swift-a8k2mX7p"
   */
  static generateSlug(text: string, id: string): string {
    const readable = StringUtil.slugify(text);
    const encoded = this.encodeId(id);
    return `${readable}-${encoded}`;
  }

  /**
   * Encode UUID to short Base62 string (8-10 chars)
   *
   * @param uuid - UUID like "550e8400-e29b-41d4-a716-446655440000"
   * @returns Encoded like "a8k2mX7p"
   */
  static encodeId(uuid: string): string {
    const hex = uuid.replace(/-/g, '');
    const num = BigInt('0x' + hex);

    const encoded = this.toBase62(num);
    return encoded.padStart(this.ENCODED_LENGTH, '0');
  }

  /**
   * Decode Base62 string back to UUID
   *
   * @param encoded - Encoded string like "a8k2mX7p"
   * @returns UUID like "550e8400-e29b-41d4-a716-446655440000"
   */
  static decodeId(encoded: string): string {
    // Convert Base62 to BigInt
    const num = this.fromBase62(encoded);

    // Convert BigInt to hex and format as UUID
    return this.formatAsUUID(num);
  }

  /**
   * Extract ID from slug
   * Supports both formats:
   * - Full: "taylor-swift-a8k2mX7p" → UUID
   * - Short: "a8k2mX7p" → UUID
   *
   * @param slug - Slug to extract ID from
   * @returns UUID or null if invalid
   */
  static extractId(slug: string): string | null {
    if (!slug) return null;

    try {
      const parts = slug.split('-');
      const lastPart = parts[parts.length - 1];

      // Check if last part looks like encoded ID
      if (this.isEncodedId(lastPart)) {
        return this.decodeId(lastPart);
      }

      // Try entire slug (short format)
      if (this.isEncodedId(slug)) {
        return this.decodeId(slug);
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Generate short slug (encoded ID only)
   * Useful for QR codes, SMS, etc.
   *
   * @param id - UUID to encode
   * @returns Short slug like "a8k2mX7p"
   */
  static generateShortSlug(id: string): string {
    return this.encodeId(id);
  }

  /**
   * Validate slug format
   *
   * @param slug - Slug to validate
   * @returns True if valid slug format
   */
  static isValidSlug(slug: string): boolean {
    return slug ? this.extractId(slug) !== null : false;
  }
  /**
   * Get readable part from slug
   *
   * @param slug - Full slug like "taylor-swift-a8k2mX7p"
   * @returns Readable part like "taylor-swift"
   */
  static getReadablePart(slug: string): string | null {
    if (!slug) return null;

    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];

    // If last part is encoded ID, remove it
    return this.isEncodedId(lastPart) ? parts.slice(0, -1).join('-') : slug;
  }
  // ==================== Private Helper Methods ====================

  /**
   * Convert BigInt to Base62 string recursively
   */
  private static toBase62(num: bigint): string {
    if (num === 0n) return '';

    const remainder = Number(num % this.BASE62_LENGTH);
    const quotient = num / this.BASE62_LENGTH;

    return this.toBase62(quotient) + this.BASE62_CHARS[remainder];
  }

  /**
   * Convert Base62 string to BigInt
   */
  private static fromBase62(encoded: string): bigint {
    return encoded.split('').reduce((acc, char) => {
      const value = this.BASE62_CHARS.indexOf(char);

      if (value === -1) {
        throw new Error(`Invalid character in encoded ID: ${char}`);
      }

      return acc * this.BASE62_LENGTH + BigInt(value);
    }, 0n);
  }

  /**
   * Format BigInt as UUID string
   */
  private static formatAsUUID(num: bigint): string {
    const hex = num.toString(16).padStart(32, '0');

    return [
      hex.substring(0, 8),
      hex.substring(8, 12),
      hex.substring(12, 16),
      hex.substring(16, 20),
      hex.substring(20, 32),
    ].join('-');
  }

  /**
   * Check if string looks like encoded ID
   */
  private static isEncodedId(str: string): boolean {
    // Encoded IDs are 8-12 alphanumeric characters
    return /^[0-9a-zA-Z]{8,12}$/.test(str);
  }
}
export { SlugEncoderUtil };
