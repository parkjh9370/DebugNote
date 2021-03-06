import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '@toast-ui/editor/dist/toastui-editor.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';

import Comment from '../../Components/Comment';

import styled from 'styled-components';

const Box = styled.div`
  padding: 2rem 10rem;
`;
const ArticleDetail = styled.section`
  > header {
    height: 5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > .name-timestamp {
      /* border:1px solid red; */
      height: 80%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      > .timestamp {
        font-size: 0.8rem;
      }
    }
    > button {
      border: none;
      background-color: #ffffff;
      font-weight: bold;
    }
  }
  > h2 {
    border-bottom: 1px solid #e0e0e0;
    padding: 1rem 0;
  }
  > .article-modify-button-wrapper {
    display: flex;
    justify-content: flex-end;
    > button {
      border: none;
      background-color: #ffffff;
      margin-left: 0.4rem;
      padding: 0.4rem;
      font-weight: bold;
    }
  }
  /* >.viewer-wrapper{
    border: 1px solid orange;
  } */

  > h4 {
    margin: 1rem 0rem;
  }

  > .write-comments-wrapper {
    margin-top: 2rem;
    > .write-comment-wrapper {
      padding: 1rem 0rem;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      > textarea {
        width: 100%;
        height: 5rem;
        margin-bottom: 1rem;
        resize: none;
        font-size: 1.2rem;
        &:focus {
          outline: none;
        }
      }
      > button {
        height: 100%;
        margin-left: 0.5rem;
        border: none;
        background-color: #000000;
        padding: 0.4rem 1rem;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }
`;

export default function Article({
  currentArticle,
  setCurrentArticle,
  myId,
  isLogin,
}) {
  let { id } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  let [bookmarks, setBookmarks] = useState(null);

  const loadArticle = () => {
    console.log('????????? ????????????.');
    axios
      .get(`http://15.164.104.171/boards/${id}`, {
        headers: { Accept: 'application/json' },
      })
      .then(resp => {
        console.log('<Article /> ????????? ?????? ?????? ??????', resp.data);
        // console.log('?????? ???????????? ??????', resp.data.comment);

        if (resp.status === 200) {
          console.log('axios');
          const { id, title, content, createdAt, nickname, userId } =
            resp.data.board;
          console.log('1');
          const { comment } = resp.data;
          console.log('2');
          const { Bookmark } = resp.data;
          console.log('3');
          console.log(Bookmark);

          if (Bookmark !== undefined) {
            console.log('??????');
            setBookmarks(Bookmark.BoardId);
          }
          console.log('51??????');
          setCurrentArticle({
            id,
            title,
            content,
            createdAt,
            nickname,
            userId,
          });
          setComments(comment);
          console.log('axios ?????? ??? ?????????', currentArticle);
        }
      })
      .catch(() => console.log);
  };

  console.log('<Article /> ?????? ???????????? ????????? ??????----->', currentArticle);
  console.log('<Article /> ?????? ???????????? ?????? ?????? ??????----->', comments);
  // console.log('???????????? ??? ????????? ------>', currentArticle.content);

  //* ?????? ?????????
  const deleteArticle = () => {
    console.log('?????? ??????');
    axios
      .delete(`http://15.164.104.171/boards/${id}`)
      .then(response => {
        if (response.status === 200) {
          alert('?????????????????????');
          navigate('/');
        }
      })
      .catch(() => alert('?????? ????????? ???????????? ????????? ??? ????????????'));
  };

  // ?????? ?????? ??????
  const commentEditCallback = editedComment => {
    // console.log('?????? ??????', editedComment);
    console.log('comments??? ??????', comments);
    const idx = comments.findIndex(el => el.id === editedComment.id);

    setComments([
      ...comments.slice(0, idx),
      editedComment,
      ...comments.slice(idx + 1),
    ]);
  };
  // ?????? ?????? ????????? ??????
  const handleInputValue = e => {
    setCommentContent(e.target.value);
  };

  // ?????? ??????
  const submitComment = () => {
    console.log('????????????');
    axios
      .post(
        `http://15.164.104.171/comments/${id}`,
        { comment: commentContent },
        {
          headers: { Accept: 'application/json' },
        },
      )
      .then(resp => {
        console.log('?????? ?????? ?????? ???', resp.data);
        // ???????????? ????????? ?????? ????????? ??????
        // textarea ????????? ?????????
        setCommentContent('');
        const { BoardId, comment, createdAt, updatedAt, UserId } =
          resp.data.comment;

        //console.log(id1, '<Article>');
        const commentObj = {
          id: BoardId,
          comment,
          createdAt,
          updatedAt,
          nickname: resp.data.nickname,
          userId: UserId,
        };

        setComments([commentObj, ...comments]);
      })
      .catch(console.log);
  };

  const moveToEdit = () => {
    console.log(myId, currentArticle.userId, '???????????? ???????');
    if (myId === currentArticle.userId) {
      navigate('/edit');
    } else {
      alert('??????????????? ???????????? ????????? ??? ????????????');
    }
  };

  //!
  useEffect(() => {
    loadArticle();
  }, []);

  console.log('<Article /> ?????? ???????????? ?????? ??????', comments);
  console.log('<Article /> props??? ?????? currentArticle ??????: ', currentArticle);

  const addBookmark = () => {
    axios
      .post(`http://15.164.104.171/bookmarks/${id}`)
      .then(response => {
        if (response.status === 203) {
          alert('????????? ??????????????????');
          setBookmarks(1);
        } else {
          console.log('????????? ?????? ??????');
        }
      })
      .catch(err => console.log(err));
  };

  const deleteBookmark = () => {
    axios
      .delete(`http://15.164.104.171/bookmarks/${id}`)
      .then(response => {
        if (response.status === 200) {
          alert('????????? ??????????????????');
          setBookmarks(null);
        } else {
          console.log('????????? ?????? ??????');
        }
      })
      .catch(err => console.log(err));
  };
  const parsedDate = new Date(currentArticle.createdAt).toLocaleDateString(
    'ko-kr',
  );
  return (
    <Box>
      <ArticleDetail className="article-wrapper">
        <header>
          <div className="name-timestamp">
            <div>{currentArticle.nickname}</div>
            <div className="timestamp">{parsedDate}</div>
          </div>
          {isLogin === true ? (
            bookmarks === null ? (
              <button onClick={addBookmark}>???????????????</button>
            ) : (
              <button onClick={deleteBookmark}>???????????????</button>
            )
          ) : null}
        </header>
        <h2>{currentArticle.title}</h2>
        {isLogin ? (
          <div className="article-modify-button-wrapper">
            <button onClick={moveToEdit}>??????</button>
            <button onClick={deleteArticle}>??????</button>{' '}
          </div>
        ) : null}
        <div className="viewer-wrapper">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return inline ? (
                  // ?????? (``)
                  <code
                    style={{
                      background:
                        'linear-gradient( to right, var(--sub-highlight-color) 15%, var(--highlight-color) 85%, var(--sub-highlight-color) )',
                      padding: '2px',
                      borderRadius: '3px',
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                ) : match ? (
                  // ?????? (```)
                  <SyntaxHighlighter
                    style={nord}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <SyntaxHighlighter
                    style={nord}
                    language="textile"
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              },
              // ????????? (>)
              blockquote({ node, children, ...props }) {
                return (
                  <div
                    style={{
                      background: '#f0f0f0',
                      padding: '1px 15px',
                      borderRadius: '10px',
                    }}
                    {...props}
                  >
                    {children}
                  </div>
                );
              },
              img({ node, ...props }) {
                return (
                  <img
                    style={{ maxWidth: '60vw' }}
                    src={props.src.replace('../../../../public/', '/')}
                    alt="MarkdownRenderer__Image"
                  />
                );
              },
            }}
          >
            {currentArticle.content
              .replace(/\n\s\n\s/gi, '\n\n&nbsp;\n\n')
              .replace(/\*\*/gi, '@$_%!^')
              .replace(/\**\*/gi, '/')
              .replace(/@\$_%!\^/gi, '**')
              .replace(/<\/?u>/gi, '*')}
          </ReactMarkdown>
        </div>

        <section className="write-comments-wrapper">
          <h4>??????{comments.length}</h4>
          <div className="write-comment-wrapper">
            {isLogin ? (
              <>
                <textarea
                  placeholder="????????? ???????????????"
                  onChange={handleInputValue}
                  value={commentContent}
                ></textarea>

                <button onClick={submitComment}>?????? ??????</button>
              </>
            ) : null}
          </div>
          <div className="comments-list-wrapper">
            <div>
              {comments.length !== 0
                ? comments.map(comment => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      commentEditCallback={commentEditCallback}
                      boardId={id}
                      commentContent={commentContent}
                      setComments={setComments}
                      isLogin={isLogin}
                      myId={myId}
                    />
                  ))
                : null}
            </div>
          </div>
        </section>
      </ArticleDetail>
    </Box>
  );
}
