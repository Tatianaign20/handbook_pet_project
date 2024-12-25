import { faqItemsSlice } from './faqSlice';
import { TFaqItemsState } from './faqSlice';
import { initialState } from './faqSlice';

const faqSliceReduser = faqItemsSlice.reducer;

const testFaqItem = {
  id: 1,
  title: 'title 1',
  text: 'text 1'
};

describe('проверка faqSliceReduser', () => {
  let state: TFaqItemsState;
  beforeEach(() => {
    state = initialState;
  });

  it('проверка добавления', () => {
    const newState = faqSliceReduser(initialState, {
      type: 'faqItems/addFaqItem',
      payload: testFaqItem
    });
    expect(newState.data).toHaveLength(1);
    expect(newState.data[0]).toEqual(testFaqItem);
  });

  it('проверка удаления', () => {
    const actionBefore = faqItemsSlice.actions.addFaqItem(testFaqItem);
    state = faqSliceReduser(state, actionBefore);
    const action = {
      type: 'faqItems/deleteFaqItem',
      payload: testFaqItem.id
    };
    const newState = faqSliceReduser(state, action);
    expect(newState.data).toHaveLength(1);
    expect(newState.data.map((card) => card.id)).not.toContain(
      'testFaqItem.id'
    );
  });

  it('проверка редактирования ', () => {
    const testFaqItemEdit = {
      ...testFaqItem,
      title: 'NewTitle',
      text: 'NewText'
    };
    const modifiedInitialState = {
      ...initialState,
      data: [testFaqItem]
    };

    const newState = faqSliceReduser(modifiedInitialState, {
      type: 'faqItems/updateFaqItem',
      payload: testFaqItemEdit
    });
    expect(newState.data[0].text).toBe(testFaqItemEdit.text);
    expect(newState.data[0].title).toBe(testFaqItemEdit.title);
  });
});
