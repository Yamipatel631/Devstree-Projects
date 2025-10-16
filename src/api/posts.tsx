import axios from "axios";

const base_URL = "https://jsonplaceholder.typicode.com";

export const fetchPosts = async() => {
  const {data} = await axios.get (`${base_URL}/posts`);
  return data;
}

export const fetchPostsById = async (id: string) => {
  const {data} = await axios.get(`${base_URL}/posts/${id}`);
  return data;
}

export const fetchCommentByPostId = async (id: string) => {
  const {data} = await axios.get(`${base_URL}/posts/${id}/comments`);
  return data;
}

