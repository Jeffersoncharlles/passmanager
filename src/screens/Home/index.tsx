import React, { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage
} from './styles';

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];



export function Home() {
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
    // Get asyncStorage data, use setSearchListData and setData
    const datakey = '@savepass:logins';
    const response = await AsyncStorage.getItem(datakey);

    if (!response) return;

    setData(JSON.parse(response));
    setSearchListData(JSON.parse(response));

  }
  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  function handleFilterLoginData(search: string) {
    // Filter results inside data, save with setSearchListData

    // const FilterLoginDataFormatted = data.filter(item=>{
     
    //   if (item.title.indexOf(search) > - 1) {
    //     return true;
    //   }else{
    //     return false;
    //   }
      
    // });
    // setSearchListData(FilterLoginDataFormatted);
    if (!search) {
      loadData()
    }else{
      setSearchListData(oldState => oldState.filter(
        login => login.title.toLowerCase().includes(
          search.toLowerCase()
        )
      ))
    }
  }

  return (
    <Container>
      <SearchBar
        placeholder="Pesquise pelo nome do serviço"
        onChangeText={(value) => handleFilterLoginData(value)}
      />

      <LoginList
        keyExtractor={(item) => item.id}
        data={searchListData}
        ListEmptyComponent={(
          <EmptyListContainer>
            <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
          </EmptyListContainer>
        )}
        renderItem={({ item: loginData }) => {
          return <LoginDataItem
            title={loginData.title}
            email={loginData.email}
            password={loginData.password}
          />
        }}
      />
    </Container>
  )
}