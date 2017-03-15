describe('<my-element>', () => {
  before(() => {
    this.testElement = document.getElementById('fixture');
    this.sinon.stub(console, 'warn');
  });

  it('has single property', () => {
    assert(this.testElement.foo === myStore.model.foo);
  });

  it('has deep property', () => {
    assert(this.testElement.deepVar === myStore.model.xxx.xx.x);
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
    });

  });

  describe('has state observers', () => {

    it('that listen to store changes', () => {
      assert(this.testElement.myColorsCounter !== 'hasColors');
      testElement.dispatch({
        store: 'myStore',
        action: 'addColor',
        payload: 'red'
      });
      assert(this.testElement.myColorsCounter === 'hasColors');

      assert(this.testElement.myFoo !== 'newValue');
      testElement.dispatch({
        store: 'myStore',
        action: 'changeFoo',
        payload: 'other'
      });
      assert(this.testElement.myFoo === 'newValue');

    });

  });

  it('have access to getStateProperty() method', () => {
    expect(this.testElement.getStateProperty)
    .that.is.not.undefined
    .is.a.function;

    assert(this.testElement.getStateProperty('myStore', 'foo') === 'bar');

  });
});
