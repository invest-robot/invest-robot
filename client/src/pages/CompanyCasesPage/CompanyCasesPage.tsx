import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanyCases } from '@/lib/storage';

export default function CompanyCasesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const cases = getCompanyCases();
    if (cases.length > 0) {
      navigate(`/company-cases/${cases[0].slug}`, { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-sm text-muted-foreground">正在加载案例内容...</p>
    </div>
  );
}
