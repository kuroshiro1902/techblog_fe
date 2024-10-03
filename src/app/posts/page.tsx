import ProtectedRoute from '@/routes/ProtectedRoute';
import { useState } from 'react';

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
