import { useEffect, useState } from 'react';

import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';



const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);//判斷是不是加載中
  const [httpError, setHttpError] = useState();//undefined 判斷有沒有fetch到data

  useEffect(() => {

    //get 異步處理資料另外定義一個function 讓useEffect不是回傳promise useEffect的返回值是要在卸載組件時調用的
    const fetchMeals = async () => {
      //定義時加入 async 的函數會變成回傳Promise，且實作中的 return 的值會被當做 resolve value
      const response = await fetch('https://react-http-5f935-default-rtdb.firebaseio.com/meals.json');

      //判斷資料有沒有抓取成功
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const responseData = await response.json();

      //組裝meals data[]
      const loadedMeals = [];

      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price,
        });
      }

      setMeals(loadedMeals);
      setIsLoading(false);
    };

    //fetchMeals 是一個異步函數 return promise
    //如果我們拋出一個錯誤而不是一個promise，該錯誤將導致該promise被拒絕
    //所以不能使用 try-catch 來包裝它
    // try{
    //   fetchMeals();
    // }catch(error){
    //   setIsLoading(false);
    //   setHttpError(error.message);
    // }

    fetchMeals().catch((error) => {
      setIsLoading(false);
      setHttpError(error.message);
    });

  }, []);//只會在組件首次加載時運行

  //加載中的話顯示
  if (isLoading) {
    return (
      <section className={classes.MealsLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  //加載失敗顯示
  if (httpError) {
    return (
      <section className={classes.MealsError}>
        <p>{httpError}</p>
      </section>
    );
  }

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;