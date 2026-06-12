import rateLimit from '@/lib/rate-limit';

describe('Rate Limiter', () => {
  it('should allow requests below limit', async () => {
    const limiter = rateLimit({ uniqueTokenPerInterval: 500, interval: 60000 });
    await expect(limiter.check(5, '127.0.0.1')).resolves.toBeUndefined();
    await expect(limiter.check(5, '127.0.0.1')).resolves.toBeUndefined();
  });

  it('should reject requests above limit', async () => {
    const limiter = rateLimit({ uniqueTokenPerInterval: 500, interval: 60000 });
    await expect(limiter.check(2, '192.168.1.1')).resolves.toBeUndefined();
    await expect(limiter.check(2, '192.168.1.1')).resolves.toBeUndefined();
    await expect(limiter.check(2, '192.168.1.1')).rejects.toMatch('Rate limit exceeded');
  });
});
