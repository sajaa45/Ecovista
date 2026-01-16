import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css';
import { AddGroup } from './AddGroup';

const GroupPage = () => {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_TRAVELGROUP_API}/travel-group`);
        if (!response.ok) {
          throw new Error('Failed to fetch travel groups');
        }
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleServiceClick = (route) => {
    navigate(`/travel-groups/${route}`);
  };

  const filteredGroups = groups.filter((group) =>
    group.group_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGroupAdded = (newGroup) => {
    setGroups([...groups, newGroup]); // Add the new group to the list
    navigate(`/travel-groups/${newGroup.group_name}`); // Navigate to the newly created group
  };

  return (
    <div className="Destinationpage">
      <section id="destination-section" className="destinations">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a travel group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <h1>Available Travel Groups</h1>
        </div>

        {!isAdding && (
          <button className="cta-button" onClick={() => setIsAdding(true)}>
            Add Travel Group
          </button>
        )}

        {isAdding && <AddGroup setIsAdding={setIsAdding} onGroupAdded={handleGroupAdded} />}

        {loading ? (
          <div className="spinner-container">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredGroups.length > 0 ? (
          <div className="destinations-list">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="destination"
                onClick={() => handleServiceClick(group.group_name)}
              >
                <div className="dest_info">
                  <h1>{group.group_name.toUpperCase()}</h1>
                  <h2>{group.destination}</h2>
                  <p>
                    <strong>From: </strong>
                    {group.start_date}
                  </p>
                  <p>
                    <strong>To: </strong>
                    {group.end_date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No travel groups found.</p>
        )}
      </section>
    </div>
  );
};

export default GroupPage;
