import PathInfo from './path-info';

describe('PathInfo', () => {
  it('should be defined', () => {
    const pathInfo = new PathInfo('/collection');

    expect(pathInfo).toBeInstanceOf(PathInfo);
  });
});
