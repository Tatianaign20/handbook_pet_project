import { setCookie, getCookie } from './cookie';
import { TCard, TFaqItems, TMenuItems, TUser } from '@utils-types';

// const URL = process.env.BURGER_API_URL;
export const URLDB = 'http://localhost:3001';
const URL = 'https://norma.nomoreparties.space/api';

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

export type TServerResponseStatus = { success: boolean };

export type TServerResponse<T> = TServerResponseStatus & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};
//Получаем menuItem
export const getMenuItemsApi = () =>
  fetch(`${URLDB}/menuitem`)
    .then((res) => res.json())
    .then((data) => data);

//Удаляем MenuItems
export const delMenuItemApi = (id: string) =>
  fetch(`${URLDB}/menuitem/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
    .then((res) => {
      if (res.status === 204) {
        // если статус 204, контент в ответе отсутствует
        return null;
      }

      //как JSON
      return res.json();
    })
    .then((data) => data) // возвращаем данны
    .catch((error) => {
      console.error('Ошибка при удалении:', error);
      throw error;
    });

//Добавление menuItem
export const addMenuItemApi = (data: TMenuItems) =>
  fetch(`${URLDB}/menuitem`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => res.json())
    .then((data) => data);

//Изменяем MenuItem
export const changeMenuItemApi = (data: { id: string; name: string }) =>
  fetch(`${URLDB}/menuitem/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ name: data.name })
  })
    .then((res) => res.json())
    .then((data) => data);

//Получаем faqItem
export const getFaqItemsApi = () =>
  fetch(`${URLDB}/faqitem`)
    .then((res) => res.json())
    .then((data) => data);

//Поиск faqItem
export const searchFaqItemApi = (str: string) =>
  fetch(`${URLDB}/faqitem?title=${str}`)
    .then((res) => res.json())
    .then((data) => data);

//Удаляем faqItems
export const delFaqItemApi = (id: number) =>
  fetch(`${URLDB}/faqitem/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
    .then((res) => res.json())
    .then((data) => data);

//Добавление faqItem
export const addFaqItemApi = (data: TFaqItems) =>
  fetch(`${URLDB}/faqitem`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => res.json())
    .then((data) => data);

//Изменяем faqItem
export const changeFaqItemApi = (data: {
  id: number;
  title: string;
  text: string;
}) =>
  fetch(`${URLDB}/faqitem/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ title: data.title, text: data.text })
  })
    .then((res) => res.json())
    .then((data) => data);

//Получаем Cards
export const getCardsApi = (id: number) =>
  fetch(`${URLDB}/menuitem/card/${id}`)
    .then((res) => res.json())
    .then((data) => data);

//Удаляем Card
export const delCardApi = (menuItemId: number, id: number) =>
  fetch(`${URLDB}/menuitem/card/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ menuItemId: menuItemId })
  })
    .then((res) => res.json())
    .then((data) => data);

//Добавление Card
export const addCardApi = (data: TCard) =>
  fetch(`${URLDB}/menuitem/card`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      menuItemId: data.menuItemId,
      serialNumber: data.serialNumber,
      image: data.image,
      text: data.text
    })
  })
    .then((res) => res.json())
    .then((data) => data);

//Изменяем Card
export const changeCardTextApi = (data: {
  id: number;
  menuItemId: number;
  text: string;
}) =>
  fetch(`${URLDB}/menuitem/card/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ menuItemId: data.menuItemId, text: data.text })
  })
    .then((res) => res.json())
    .then((data) => data);

//Изменяем Card Image
export const changeCardImageApi = (data: {
  imageName: string;
  imageFile: File;
}) => {
  const formData = new FormData();
  formData.append('cardId', data.imageName);
  formData.append('image', data.imageFile);
  console.log(data.imageName);
  return fetch(`${URLDB}/menuitem/card/upload`, {
    method: 'POST',
    body: formData
  })
    .then((res) => res.json())
    .then((data) => data);
};

export type TLoginData = {
  email: string;
  password: string;
};

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

//Логинимся
export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<any>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const getUserApi = () =>
  fetchWithRefresh<any>(`${URL}/auth/user`, {
    headers: {
      authorization: getCookie('accessToken')
    } as HeadersInit
  });

export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));
