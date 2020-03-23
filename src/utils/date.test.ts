import { getCountdownAsString } from './date';

describe('date', () => {

  describe('getCountdownAsString', () => {
    it('should return no alerts as default', () => {
      expect(getCountdownAsString(0)).toEqual('0:0:00.000');
      expect(getCountdownAsString(1000)).toEqual('0:0:01.000');
      expect(getCountdownAsString(60 * 1000)).toEqual('0:1:60.000');
      expect(getCountdownAsString(11 * 60 * 1000)).toEqual('0:11:660.000');

      expect(getCountdownAsString(-1000)).toEqual('- 0:0:01.000');
      expect(getCountdownAsString(-60 * 1000)).toEqual('- 0:1:60.000');
      expect(getCountdownAsString(-11 * 60 * 1000)).toEqual('- 0:11:660.000');
    });
  });

});

