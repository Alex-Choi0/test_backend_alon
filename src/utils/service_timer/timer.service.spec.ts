import { TimerService } from './timer.service';

export const TimeServiceMock = {
  calDateTime: jest.fn(),
  calculateDaysBetween: jest.fn(),
};

describe('TimerService', () => {
  let timerService: TimerService;

  beforeEach(() => {
    timerService = new TimerService();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('calDateTimer', () => {
    it('should add the specified number of days to the given date', () => {
      const initialDate = new Date('2024-07-23'); // Example date
      const daysToAdd = 10;

      const resultDate = timerService.calDateTime(initialDate, daysToAdd);

      // Expected date is 10 days after the initial date
      const expectedDate = new Date('2024-08-02');

      expect(resultDate).toEqual(expectedDate);
    });

    it('should handle negative days to subtract from the given date', () => {
      const initialDate = new Date('2024-07-23'); // Example date
      const daysToSubtract = -5;

      const resultDate = timerService.calDateTime(initialDate, daysToSubtract);

      // Expected date is 5 days before the initial date
      const expectedDate = new Date('2024-07-18');

      expect(resultDate).toEqual(expectedDate);
    });

    it('should correctly handle month boundaries', () => {
      const initialDate = new Date('2024-01-31'); // Example date at end of January
      const daysToAdd = 1;

      const resultDate = timerService.calDateTime(initialDate, daysToAdd);

      // Expected date should be February 1st
      const expectedDate = new Date('2024-02-01');

      expect(resultDate).toEqual(expectedDate);
    });

    it('should return the same date when adding 0 days', () => {
      const initialDate = new Date('2024-07-23'); // Example date
      const daysToAdd = 0;

      const resultDate = timerService.calDateTime(initialDate, daysToAdd);

      // Expected date should be the same as the initial date
      expect(resultDate).toEqual(initialDate);
    });
  });
});
