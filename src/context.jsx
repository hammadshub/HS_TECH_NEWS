//  context creation
// provider
// consumer❌ replaced by ↙
// useContext hook

import React, {useContext, useEffect, useReducer } from "react";
 import reducer from "./assets/reducer";

 let API ="http://hn.algolia.com/api/v1/search?";


const initialState = {
    isLoading : true,
    query:"HTML",
    nbPages:0,
    page:0,
    hits:[],
};


const AppContext = React.createContext();



//provider

const AppProvider =({children})=>{

const [state, dispatch]=useReducer(reducer ,initialState);




// pagination

const getNextPage=()=>{
dispatch({type:"NEXT_PAGE",})
}


const getPrevPage=()=>{
    dispatch({type:"PREV_PAGE",})
    }



const fetchApiData = async(url)=>{

dispatch({type:"SET_LOADING"});

    try{
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
        // isLoading = false;
        dispatch({
            type:"GET_STORIES",
                  payload:{
                      hits: data.hits,
                      nbPages:data.nbPages,
                  },
    });
    } catch (error){
        console.log(error);
    }
};


// to remove post
const removePost=(post_ID)=>{

    dispatch({type:"REMOVE_POST" , payload:post_ID});
}

// search

const searchPost=(searchQuery)=>{
    dispatch({type:"SEARCH_QUERY",payload:searchQuery});
}



useEffect(()=>{
    fetchApiData(`${API}query=${state.query}&page=${state.page}`);
},[state.query,state.page]);


    return (
        <AppContext.Provider value={{...state, removePost, searchPost,getNextPage,getPrevPage}}>
            {children}
        </AppContext.Provider>
    )
}

// custom hook creation

const useGlobalContext =()=>{
    return useContext(AppContext);
}


export {AppContext, AppProvider,useGlobalContext};