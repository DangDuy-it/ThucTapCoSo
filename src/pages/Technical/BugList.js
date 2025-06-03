import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/TechnicalHome.css';
import TechnicalHome from '../../components/TechnicalHome';
import { FilterContext } from '../../components/FilterContext';

function BugList() {
  const { setFilterStatus } = useContext(FilterContext);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/technical/responsed') {
      setFilterStatus('resolved');
    } else if (location.pathname === '/technical/unresponse') {
      setFilterStatus('pending');
    } else if (location.pathname === '/technical') {
      setFilterStatus('all');
    }
  }, [location.pathname, setFilterStatus]);

  return (
    <div className="content">
      <TechnicalHome />
    </div>
  );
}

export default BugList;