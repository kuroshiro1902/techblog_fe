import ProtectedRoute from '@/routes/ProtectedRoute';

export const fetchCache = 'force-no-store';

function PostPage() {
  return (
    <div>
      <ProtectedRoute />
      Post page
    </div>
  );
}

export default PostPage;
