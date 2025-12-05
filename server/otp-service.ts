import { nanoid } from 'nanoid';

interface OTPData {
  code: string;
  email: string;
  expiresAt: number;
  attempts: number;
  type: 'email_verification' | 'password_reset' | '2fa';
}

class OTPService {
  private otpStore = new Map<string, OTPData>();
  private readonly OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_ATTEMPTS = 5;
  private readonly OTP_LENGTH = 6;

  /**
   * Generate a 6-digit OTP code
   */
  private generateOTPCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generate and store OTP
   */
  async generateOTP(
    email: string,
    type: 'email_verification' | 'password_reset' | '2fa' = 'email_verification'
  ): Promise<{ code: string; expiresIn: number }> {
    // Clean up expired OTPs
    this.cleanupExpiredOTPs();

    // Generate OTP code
    const code = this.generateOTPCode();
    const expiresAt = Date.now() + this.OTP_EXPIRY;

    // Store OTP
    const otpKey = `${email}_${type}`;
    this.otpStore.set(otpKey, {
      code,
      email,
      expiresAt,
      attempts: 0,
      type,
    });

    console.log(`📧 OTP generated for ${email}: ${code} (expires in ${this.OTP_EXPIRY / 1000}s)`);

    return {
      code,
      expiresIn: this.OTP_EXPIRY / 1000, // in seconds
    };
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(
    email: string,
    code: string,
    type: 'email_verification' | 'password_reset' | '2fa' = 'email_verification'
  ): Promise<{ valid: boolean; error?: string }> {
    const otpKey = `${email}_${type}`;
    const otpData = this.otpStore.get(otpKey);

    if (!otpData) {
      return {
        valid: false,
        error: 'OTP not found or expired. Please request a new one.',
      };
    }

    // Check if expired
    if (Date.now() > otpData.expiresAt) {
      this.otpStore.delete(otpKey);
      return {
        valid: false,
        error: 'OTP has expired. Please request a new one.',
      };
    }

    // Check attempts
    if (otpData.attempts >= this.MAX_ATTEMPTS) {
      this.otpStore.delete(otpKey);
      return {
        valid: false,
        error: 'Maximum verification attempts exceeded. Please request a new OTP.',
      };
    }

    // Increment attempts
    otpData.attempts++;

    // Verify code
    if (otpData.code !== code) {
      return {
        valid: false,
        error: `Invalid OTP code. ${this.MAX_ATTEMPTS - otpData.attempts} attempts remaining.`,
      };
    }

    // Valid OTP - remove from store
    this.otpStore.delete(otpKey);

    return {
      valid: true,
    };
  }

  /**
   * Resend OTP (generates new code)
   */
  async resendOTP(
    email: string,
    type: 'email_verification' | 'password_reset' | '2fa' = 'email_verification'
  ): Promise<{ code: string; expiresIn: number }> {
    // Delete existing OTP
    const otpKey = `${email}_${type}`;
    this.otpStore.delete(otpKey);

    // Generate new OTP
    return this.generateOTP(email, type);
  }

  /**
   * Check if OTP exists and is valid
   */
  hasValidOTP(
    email: string,
    type: 'email_verification' | 'password_reset' | '2fa' = 'email_verification'
  ): boolean {
    const otpKey = `${email}_${type}`;
    const otpData = this.otpStore.get(otpKey);

    if (!otpData) {
      return false;
    }

    // Check if expired
    if (Date.now() > otpData.expiresAt) {
      this.otpStore.delete(otpKey);
      return false;
    }

    return true;
  }

  /**
   * Get remaining time for OTP
   */
  getRemainingTime(
    email: string,
    type: 'email_verification' | 'password_reset' | '2fa' = 'email_verification'
  ): number {
    const otpKey = `${email}_${type}`;
    const otpData = this.otpStore.get(otpKey);

    if (!otpData) {
      return 0;
    }

    const remaining = Math.max(0, otpData.expiresAt - Date.now());
    return Math.floor(remaining / 1000); // in seconds
  }

  /**
   * Clean up expired OTPs
   */
  private cleanupExpiredOTPs(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.otpStore.forEach((otpData, key) => {
      if (now > otpData.expiresAt) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => this.otpStore.delete(key));

    if (expiredKeys.length > 0) {
      console.log(`🧹 Cleaned up ${expiredKeys.length} expired OTPs`);
    }
  }

  /**
   * Delete OTP
   */
  deleteOTP(
    email: string,
    type: 'email_verification' | 'password_reset' | '2fa' = 'email_verification'
  ): void {
    const otpKey = `${email}_${type}`;
    this.otpStore.delete(otpKey);
  }

  /**
   * Get OTP statistics
   */
  getStats(): {
    totalOTPs: number;
    byType: Record<string, number>;
  } {
    const stats = {
      totalOTPs: this.otpStore.size,
      byType: {
        email_verification: 0,
        password_reset: 0,
        '2fa': 0,
      },
    };

    this.otpStore.forEach(otpData => {
      stats.byType[otpData.type]++;
    });

    return stats;
  }
}

// Singleton instance
export const otpService = new OTPService();

// Periodic cleanup every 5 minutes
setInterval(() => {
  (otpService as any).cleanupExpiredOTPs();
}, 5 * 60 * 1000);

export default otpService;
