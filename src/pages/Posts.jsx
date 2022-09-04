import React, { useState, useEffect, useRef } from 'react';
import PostService from '../API/PostService';
import PostFilter from '../Components/PostFilter';
import PostForm from '../Components/PostForm';
import PostList from '../Components/PostList';
import MyButton from '../Components/UI/Button/MyButton';
import MyModal from '../Components/UI/Modal/MyModal';
import Loader from '../Components/UI/Loader/Loader';
import Pagination from '../Components/UI/Pagination/Pagination';
import { useFetching } from '../hooks/useFetching';
import { usePosts } from '../hooks/usePosts';
import { getPageCount } from '../Components/utils/pages';
import { useObserver } from '../hooks/useObserver';
import MySelect from '../Components/UI/Select/MySelect';

function Posts () {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({ sort: '', query: '' });
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const lastElement = useRef();

  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);

  const [fetchPosts, isPostLoading, postError] = useFetching(async () => {
    const response = await PostService.getAll(limit, page);
    setPosts([...posts, ...response.data]);
    const totalCount = response.headers['x-total-count'];
    setTotalPages(getPageCount(totalCount, limit));
  });

  useObserver(lastElement, page < totalPages, isPostLoading, () => {
    setPage(page + 1);
  });

  useEffect(() => {
    fetchPosts(limit, page);
  }, [page, limit]);

  const createPost = (newPost) => {
    setPosts([...posts, newPost]);
    setModal(false);
  };

  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id));
  };

  const changePage = (page) => {
    setPage(page);
  }

  return (
    <div className="App">
      <button onClick={fetchPosts}>
        get posts
      </button>
      <MyButton style={{ marginTop: 30 }} onClick={() => setModal(true)}>
        Создать пользователя
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost} />
      </MyModal>
      <hr style={{ margin: '15px 0' }} />
      <PostFilter
        filter={filter}
        setFilter={setFilter}
      />
      <MySelect
        value={limit}
        onChange={value => setLimit(value)}
        defaultValue='Кол-во элементов на странице'
        options={[
          {value: 5, name: '5'},
          {value: 10, name: '10'},
          {value: 15, name: '15'},
          {value: -1, name: 'Показать все'}
        ]}
      />
      {postError &&
        <h1>Произошла ошибка ${postError}</h1>
      }
      <PostList remove={removePost} posts={sortedAndSearchedPosts} title={'Список постов про JS'} />
      <div ref={lastElement} style={{ height: 20, backgroundColor: 'red' }}></div>
      {isPostLoading &&
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
          <Loader />
        </div>
      }
      <Pagination
        page={page}
        totalPages={totalPages}
        changePage={changePage}
      />
    </div>
  );
}

export default Posts;