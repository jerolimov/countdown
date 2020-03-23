import { getCountdownAsString } from './date';

describe('date', () => {
  
  describe('getCountdownAsString', () => {
    it('should return human readable strings for a few seconds', () => {
      expect(getCountdownAsString(0)).toEqual('00:00.000');
      expect(getCountdownAsString(1123)).toEqual('00:01.123');

      expect(getCountdownAsString(-1123)).toEqual('- 00:01.123');
    });

    it('should return human readable strings for a minutes', () => {
      expect(getCountdownAsString(1 * 60 * 1000 + 123)).toEqual('01:00.123');
      expect(getCountdownAsString(11 * 60 * 1000 + 123)).toEqual('11:00.123');
      expect(getCountdownAsString(59 * 60 * 1000 + 59 * 1000 + 999)).toEqual('59:59.999');

      expect(getCountdownAsString(-1 * 60 * 1000 - 123)).toEqual('- 01:00.123');
      expect(getCountdownAsString(-11 * 60 * 1000 - 123)).toEqual('- 11:00.123');
      expect(getCountdownAsString(-59 * 60 * 1000 - 59 * 1000 - 999)).toEqual('- 59:59.999');
    });

    it('should return human readable strings for a hours', () => {
      expect(getCountdownAsString(1 * 60 * 60 * 1000 + 123)).toEqual('01:00:00.123');
      expect(getCountdownAsString(11 * 60 * 60 * 1000 + 123)).toEqual('11:00:00.123');
      expect(getCountdownAsString(13 * 60 * 60 * 1000 + 123)).toEqual('13:00:00.123');
      expect(getCountdownAsString(23 * 60 * 60 * 1000 + 123)).toEqual('23:00:00.123');

      expect(getCountdownAsString(-1 * 60 * 60 * 1000 - 123)).toEqual('- 01:00:00.123');
      expect(getCountdownAsString(-11 * 60 * 60 * 1000 - 123)).toEqual('- 11:00:00.123');
      expect(getCountdownAsString(-13 * 60 * 60 * 1000 - 123)).toEqual('- 13:00:00.123');
      expect(getCountdownAsString(-23 * 60 * 60 * 1000 - 123)).toEqual('- 23:00:00.123');
    });

    it('should return human readable strings for a days', () => {
      expect(getCountdownAsString(24 * 60 * 60 * 1000 + 123)).toEqual('1d 00:00:00.123');
      expect(getCountdownAsString(48 * 60 * 60 * 1000 + 123)).toEqual('2d 00:00:00.123');
      expect(getCountdownAsString(72 * 60 * 60 * 1000 + 123)).toEqual('3d 00:00:00.123');

      expect(getCountdownAsString(-24 * 60 * 60 * 1000 - 123)).toEqual('- 1d 00:00:00.123');
      expect(getCountdownAsString(-48 * 60 * 60 * 1000 - 123)).toEqual('- 2d 00:00:00.123');
      expect(getCountdownAsString(-72 * 60 * 60 * 1000 - 123)).toEqual('- 3d 00:00:00.123');
    });
  });

});

