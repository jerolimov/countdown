import { getTimeWithMilliseconds } from './date';

describe('date', () => {
  
  describe('getTimeWithMilliseconds', () => {
    it('should return human readable strings for a few seconds', () => {
      expect(getTimeWithMilliseconds(0)).toEqual('00:00.000');
      expect(getTimeWithMilliseconds(1123)).toEqual('00:01.123');

      expect(getTimeWithMilliseconds(-1123)).toEqual('- 00:01.123');
    });

    it('should return human readable strings for a minutes', () => {
      expect(getTimeWithMilliseconds(1 * 60 * 1000 + 123)).toEqual('01:00.123');
      expect(getTimeWithMilliseconds(11 * 60 * 1000 + 123)).toEqual('11:00.123');
      expect(getTimeWithMilliseconds(59 * 60 * 1000 + 59 * 1000 + 999)).toEqual('59:59.999');

      expect(getTimeWithMilliseconds(-1 * 60 * 1000 - 123)).toEqual('- 01:00.123');
      expect(getTimeWithMilliseconds(-11 * 60 * 1000 - 123)).toEqual('- 11:00.123');
      expect(getTimeWithMilliseconds(-59 * 60 * 1000 - 59 * 1000 - 999)).toEqual('- 59:59.999');
    });

    it('should return human readable strings for a hours', () => {
      expect(getTimeWithMilliseconds(1 * 60 * 60 * 1000 + 123)).toEqual('01:00:00.123');
      expect(getTimeWithMilliseconds(11 * 60 * 60 * 1000 + 123)).toEqual('11:00:00.123');
      expect(getTimeWithMilliseconds(13 * 60 * 60 * 1000 + 123)).toEqual('13:00:00.123');
      expect(getTimeWithMilliseconds(23 * 60 * 60 * 1000 + 123)).toEqual('23:00:00.123');

      expect(getTimeWithMilliseconds(-1 * 60 * 60 * 1000 - 123)).toEqual('- 01:00:00.123');
      expect(getTimeWithMilliseconds(-11 * 60 * 60 * 1000 - 123)).toEqual('- 11:00:00.123');
      expect(getTimeWithMilliseconds(-13 * 60 * 60 * 1000 - 123)).toEqual('- 13:00:00.123');
      expect(getTimeWithMilliseconds(-23 * 60 * 60 * 1000 - 123)).toEqual('- 23:00:00.123');
    });

    it('should return human readable strings for a days', () => {
      expect(getTimeWithMilliseconds(24 * 60 * 60 * 1000 + 123)).toEqual('1d 00:00:00.123');
      expect(getTimeWithMilliseconds(48 * 60 * 60 * 1000 + 123)).toEqual('2d 00:00:00.123');
      expect(getTimeWithMilliseconds(72 * 60 * 60 * 1000 + 123)).toEqual('3d 00:00:00.123');

      expect(getTimeWithMilliseconds(-24 * 60 * 60 * 1000 - 123)).toEqual('- 1d 00:00:00.123');
      expect(getTimeWithMilliseconds(-48 * 60 * 60 * 1000 - 123)).toEqual('- 2d 00:00:00.123');
      expect(getTimeWithMilliseconds(-72 * 60 * 60 * 1000 - 123)).toEqual('- 3d 00:00:00.123');
    });
  });

});

