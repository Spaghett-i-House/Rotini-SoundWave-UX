import { TestBed } from '@angular/core/testing';

import { VisualizerService } from './visualizer.service';

describe('VisualizerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisualizerService = TestBed.get(VisualizerService);
    expect(service).toBeTruthy();
  });
});
