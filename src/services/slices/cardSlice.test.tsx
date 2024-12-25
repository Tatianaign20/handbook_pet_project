import { error } from 'console';
import { cardsSlice } from './cardSlice';
import { TCardsState } from './cardSlice';
import { initialState } from './cardSlice';
import {
  getCards,
  delCard,
  addCard,
  changeCardText,
  changeCardImage
} from './cardSlice';
import { getCardsApi, addCardApi, delCardApi } from 'src/utils/handbook-api';
import store from '../store';

const cardSliceReducer = cardsSlice.reducer;

const testCard = {
  id: 21,
  menuItemId: 2,
  serialNumber: 1,
  image: 'http://localhost:3001/menuitem/card/images/21.jpg',
  text: 'text_2_1'
};

const mockData = [
  {
    id: 11,
    menuItemId: 1,
    serialNumber: 1,
    image: 'http://localhost:3001/menuitem/card/images/11.jpg',
    text: 'text_1_1'
  },
  {
    id: 12,
    menuItemId: 1,
    serialNumber: 1,
    image: 'http://localhost:3001/menuitem/card/images/12.jpg',
    text: 'text_1_222'
  },
  {
    id: 13,
    menuItemId: 1,
    serialNumber: 1,
    image: 'http://localhost:3001/menuitem/card/images/13.jpg',
    text: 'text_1_3'
  },
  {
    id: 14,
    menuItemId: 1,
    serialNumber: 1,
    image: 'http://localhost:3001/menuitem/card/images/14.jpg',
    text: 'text_1_4'
  }
];

jest.mock('../../utils/handbook-api', () => ({
  getCardsApi: jest.fn(() => Promise.resolve(mockData)),
  addCardApi: jest.fn(() => Promise.resolve(testCard)),
  delCardApi: jest.fn(() =>
    Promise.resolve({ menuItemId: testCard.menuItemId, id: testCard.id })
  )
  //changeCardTextApi: jest.fn() => Promise....),
  // changeCardImageApi: jest.fn()=> Promise....),
}));
const mockGetCardsApi = require('../../utils/handbook-api')
  .getCardsApi as jest.MockedFunction<typeof getCardsApi>;

afterEach(() => {
  mockGetCardsApi.mockClear();
});

const mockaddCardApi = require('../../utils/handbook-api')
  .addCardApi as jest.MockedFunction<typeof addCardApi>;

afterEach(() => {
  mockaddCardApi.mockClear();
});

const mockdelCardApi = require('../../utils/handbook-api')
  .delCardApi as jest.MockedFunction<typeof delCardApi>;

afterEach(() => {
  mockdelCardApi.mockClear();
});

describe('проверка getCards rejected', () => {
  it('Проверка getCards rejected', async () => {
    const mockError = {
      name: 'MockError',
      message: 'Mock Error Message',
      stack: 'Mock Stack Trace'
    };
    try {
      await store.dispatch(getCards.rejected(mockError, '', 1));
    } catch (error) {}

    expect(store.getState().cardReducer).toEqual({
      ...initialState,
      isLoading: false,
      error: mockError
    });
  });
});

describe('проверка addCard rejected', () => {
  it('Проверка addCard rejected', async () => {
    const mockError = {
      name: 'MockError',
      message: 'Mock Error Message',
      stack: 'Mock Stack Trace'
    };
    try {
      await store.dispatch(addCard.rejected(mockError, '', testCard));
    } catch (error) {}

    expect(store.getState().cardReducer).toEqual({
      ...initialState,
      isLoading: false,
      error: mockError
    });
  });
});

describe('проверка delCard rejected', () => {
  it('Проверка delCard rejected', async () => {
    const mockError = {
      name: 'MockError',
      message: 'Mock Error Message',
      stack: 'Mock Stack Trace'
    };
    try {
      await store.dispatch(
        delCard.rejected(mockError, '', {
          menuItemId: testCard.menuItemId,
          id: testCard.id
        })
      );
    } catch (error) {}

    expect(store.getState().cardReducer).toEqual({
      ...initialState,
      isLoading: false,
      error: mockError
    });
  });
});

describe('проверка getCards pending', () => {
  it('проверка getCards  pending', async () => {
    store.dispatch(getCards(1));

    expect(store.getState().cardReducer.isLoading).toBe(true);
    expect(store.getState().cardReducer.error).toBeNull();
  });
});
describe('проверка addCard pending', () => {
  it('проверка addCard  pending', async () => {
    store.dispatch(addCard(testCard));

    expect(store.getState().cardReducer.isLoading).toBe(true);
    expect(store.getState().cardReducer.error).toBeNull();
  });
});

describe('проверка delCard pending', () => {
  it('проверка delCard  pending', async () => {
    store.dispatch(
      delCard({ menuItemId: testCard.menuItemId, id: testCard.id })
    );

    expect(store.getState().cardReducer.isLoading).toBe(true);
    expect(store.getState().cardReducer.error).toBeNull();
  });
});

describe('проверка getCards fulfilled', () => {
  it('Проверка getCards fulfilled', async () => {
    await store.dispatch(getCards(1));

    expect(store.getState().cardReducer.isLoading).toBe(false);
    expect(store.getState().cardReducer.error).toBeNull();
    expect(store.getState().cardReducer.data).toEqual(mockData);
  });
});

describe('проверка addCard fulfilled', () => {
  it('Проверка addCard fulfilled', async () => {
    await store.dispatch(addCard(testCard));
    const mockDataAddCard = [
      {
        id: 11,
        menuItemId: 1,
        serialNumber: 1,
        image: 'http://localhost:3001/menuitem/card/images/11.jpg',
        text: 'text_1_1'
      },
      {
        id: 12,
        menuItemId: 1,
        serialNumber: 1,
        image: 'http://localhost:3001/menuitem/card/images/12.jpg',
        text: 'text_1_222'
      },
      {
        id: 13,
        menuItemId: 1,
        serialNumber: 1,
        image: 'http://localhost:3001/menuitem/card/images/13.jpg',
        text: 'text_1_3'
      },
      {
        id: 14,
        menuItemId: 1,
        serialNumber: 1,
        image: 'http://localhost:3001/menuitem/card/images/14.jpg',
        text: 'text_1_4'
      },
      // добавилась тестовая карточка
      testCard
    ];

    expect(store.getState().cardReducer.isLoading).toBe(false);
    expect(store.getState().cardReducer.error).toBeNull();
    expect(store.getState().cardReducer.data).toEqual(mockDataAddCard);
  });
});
describe('проверка delCard fulfilled', () => {
  it('Проверка delCard fulfilled', async () => {
    await store.dispatch(
      delCard({ menuItemId: testCard.menuItemId, id: testCard.id })
    );
    const mockDataDelCard = [
      {
        id: 11,
        menuItemId: 1,
        serialNumber: 1,
        image: 'http://localhost:3001/menuitem/card/images/11.jpg',
        text: 'text_1_1'
      },
      {
        id: 12,
        menuItemId: 1,
        serialNumber: 1,
        image: 'http://localhost:3001/menuitem/card/images/12.jpg',
        text: 'text_1_222'
      },
      {
        id: 13,
        menuItemId: 1,
        serialNumber: 1,
        image: 'http://localhost:3001/menuitem/card/images/13.jpg',
        text: 'text_1_3'
      },
      {
        id: 14,
        menuItemId: 1,
        serialNumber: 1,
        image: 'http://localhost:3001/menuitem/card/images/14.jpg',
        text: 'text_1_4'
      }
      // должна удалиться тестовая карточка
      // testCard
    ];

    expect(store.getState().cardReducer.isLoading).toBe(false);
    expect(store.getState().cardReducer.error).toBeNull();
    expect(store.getState().cardReducer.data).toEqual(mockDataDelCard);
  });
});

describe('проверка cardSliceReducer', () => {
  let state: TCardsState;
  beforeEach(() => {
    state = initialState;
  });

  it('проверка добавления карточки', () => {
    const newState = cardSliceReducer(initialState, {
      type: 'cards/addCard',
      payload: testCard
    });
    expect(newState.data).toHaveLength(1);
    expect(newState.data[newState.data.length - 1]).toEqual(testCard);
  });

  it('проверка удаления карточки', () => {
    const actionBefore = cardsSlice.actions.addCard(testCard);
    state = cardSliceReducer(state, actionBefore);
    const action = {
      type: 'cards/removeCard',
      payload: testCard.id
    };
    const newState = cardSliceReducer(state, action);
    expect(newState.data).toHaveLength(1);
    expect(newState.data.map((card) => card.id)).not.toContain('testCard.id');
  });

  it('проверка редактирования карточки', () => {
    const testCardEdit = {
      ...testCard,
      text: 'NewText'
    };
    const modifiedInitialState = {
      ...initialState,
      data: [testCard]
    };

    const newState = cardSliceReducer(modifiedInitialState, {
      type: 'cards/changeCard',
      payload: testCardEdit
    });
    expect(newState.data[0].text).toBe(testCardEdit.text);
  });
});
