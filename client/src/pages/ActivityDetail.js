import React from 'react'
import { useParams } from 'react-router-dom'
import LayoutPage from '../components/LayoutPage'
import ActivityDetailSection from '../components/ActivityDetailSection'
import { useAuth } from '../hooks/hooks'

const ActivityDetail = () => {
  useAuth();
  const params = useParams()
  return (
    <LayoutPage target="활동게시판">
      <h1>{params.id}번 게시글 상세 페이지</h1>
      {/*클릭한 게시물의 id를 전달 */}
      <ActivityDetailSection activityId={params.id} />
    </LayoutPage>
  )
}

export default ActivityDetail