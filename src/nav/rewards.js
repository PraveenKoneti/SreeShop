import React, { useState } from 'react';
import swal from 'sweetalert';

const Rewards = () => {
    // Example rewards data
    const rewardsData = [
        { id: 1, name: "₹100 Off", description: "Get ₹100 off on your next purchase." },
        { id: 2, name: "₹500 Cashback", description: "Earn ₹500 cashback on orders over ₹3000." },
        { id: 3, name: "Bonus Points", description: "Earn 500 bonus points worth ₹50 for your next order." },
    ];

    // State to track claimed rewards
    const [claimedRewards, setClaimedRewards] = useState([]);

    // Function to handle claiming a reward
    const handleClaimReward = (rewardId) => {
        // Check if the reward has already been claimed
        if (!claimedRewards.includes(rewardId)) {
            // Add the rewardId to the claimed rewards list
            setClaimedRewards([...claimedRewards, rewardId]);

            // Optional: You can make an API call here to store the claimed reward for the user
            // Example API call (assuming you're using a backend):
            // axios.post('/api/claim-reward', { userId: userId, rewardId: rewardId });

            // Alert or UI feedback to show success
            swal("Reward claimed successfully!","","success");
        } else {
            swal('You have already claimed this reward.',"","warning")
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Your Rewards</h2>
            <div className="row">
                {rewardsData.map((reward) => (
                    <div key={reward.id} className="col-md-4 mb-3">
                        <div className={`card shadow-sm ${claimedRewards.includes(reward.id) ? 'border-success' : ''}`}>
                            <div className="card-body">
                                <h5 className="card-title text-primary">{reward.name}</h5>
                                <p className="card-text">{reward.description}</p>

                                {/* Show different buttons based on whether reward is claimed or not */}
                                {claimedRewards.includes(reward.id) ? (
                                    <button className="btn btn-success" disabled>
                                        Reward Claimed
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => handleClaimReward(reward.id)}
                                    >
                                        Claim Reward
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rewards;
