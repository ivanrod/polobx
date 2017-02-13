describe('<my-element>', () => {
  before(() => {
    this.testElement = document.getElementById('fixture');
    this.sinon.stub(console, 'warn');
  });

  it('has single property', () => {
    assert(this.testElement.foo === myStore.store.foo);
  });

  it('has deep property', () => {
    assert(this.testElement.deepVar === myStore.store.xxx.xx.x);
  });

  it('has array property', () => {
    expect(this.testElement.colors)
    .that.is.an('array')
    .to.be.empty;
  });

  describe('can dispatch actions', () => {

    it('to modify the store', () => {
      testElement.dispatch({
        store: 'myStore',
        action: 'addColor',
        payload: 'blue'
      });

      expect(this.testElement.colors)
      .that.is.an('array')
      .not.to.be.empty;
      expect(this.testElement.colors).to.include.members(['blue']);
    });

    it('and warns when action doesnt exist', () => {
      expect( console.warn.calledOnce ).to.be.false;

      testElement.dispatch({
        store: 'noStore',
        action: 'noAction',
        payload: 0
      });

      expect( console.warn.calledOnce ).to.be.true;
    })

  });

  it('have access to getStateProperty() method', () => {
    expect(this.testElement.getStateProperty)
    .that.is.not.undefined
    .is.a.function;

    assert(this.testElement.getStateProperty('myStore', 'foo') === 'bar');

  });
});
