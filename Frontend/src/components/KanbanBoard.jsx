import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './KanbanBoard.css';

const KanbanBoard = ({ requests, onStatusChange, onDurationChange }) => {
    const [columns, setColumns] = useState({
        'New': [],
        'In Progress': [],
        'Repaired': [],
        'Scrap': []
    });

    useEffect(() => {
        // Group by status
        const newCols = {
            'New': [],
            'In Progress': [],
            'Repaired': [],
            'Scrap': []
        };

        requests.forEach(req => {
            if (newCols[req.status]) {
                newCols[req.status].push(req);
            } else {
                newCols['New'].push(req);
            }
        });
        setColumns(newCols);
    }, [requests]);

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // Optimistic UI update logic handled by parent via onStatusChange usually, 
        // but for smooth DnD we update local state or let parent drive.
        // Here we just call parent to update data.
        onStatusChange(draggableId, destination.droppableId);
    };

    return (
        <div className="kanban-container-component">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-board">
                    {Object.entries(columns).map(([columnId, tasks]) => (
                        <Droppable key={columnId} droppableId={columnId}>
                            {(provided, snapshot) => (
                                <div
                                    className={`kanban-column ${columnId.toLowerCase().replace(' ', '-')}`}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h3 className="column-title">{columnId} <span className="task-count">{tasks.length}</span></h3>
                                    <div className="task-list">
                                        {tasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        className="kanban-card"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            opacity: snapshot.isDragging ? 0.8 : 1
                                                        }}
                                                    >
                                                        <div className={`priority-strip ${task.priority.toLowerCase()}`}></div>
                                                        {task.Equipment && task.Equipment.image_url && (
                                                            <div className="kanban-card-image" style={{ width: '100%', height: '120px', marginBottom: '10px', overflow: 'hidden', borderRadius: '4px' }}>
                                                                <img
                                                                    src={`http://localhost:5000${task.Equipment.image_url}`}
                                                                    alt={task.Equipment.name}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="card-content">
                                                            <h4>{task.subject}</h4>
                                                            <div className="card-meta">
                                                                <span className="equipment-name">{task.Equipment ? task.Equipment.name : 'Unknown Equipment'}</span>
                                                            </div>
                                                            <div className="card-footer" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                                    <div className="footer-left" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                                                        <select
                                                                            value={task.status}
                                                                            onChange={(e) => onStatusChange(String(task.id), e.target.value)}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            className="status-select-mini"
                                                                            style={{ fontSize: '0.8rem', padding: '2px', borderRadius: '4px', border: '1px solid #ccc' }}
                                                                        >
                                                                            <option value="New">New</option>
                                                                            <option value="In Progress">In Progress</option>
                                                                            <option value="Repaired">Repaired</option>
                                                                            <option value="Scrap">Scrap</option>
                                                                        </select>
                                                                    </div>
                                                                    {task.assignedTechnician && (
                                                                        <div className="tech-avatar" title={task.assignedTechnician.first_name}>
                                                                            {task.assignedTechnician.first_name[0]}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Overdue Indicator */}
                                                                {task.scheduled_date && new Date(task.scheduled_date) < new Date() && task.status !== 'Repaired' && task.status !== 'Scrap' && (
                                                                    <div className="overdue-badge" style={{ color: 'white', background: '#ef4444', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                                                                        OVERDUE
                                                                    </div>
                                                                )}

                                                                {/* Duration Input */}
                                                                {(task.status === 'In Progress' || task.status === 'Repaired') && (
                                                                    <div className="duration-input" style={{ width: '100%' }}>
                                                                        <input
                                                                            type="number"
                                                                            placeholder="Hrs"
                                                                            defaultValue={task.duration_hours || ''}
                                                                            onBlur={(e) => {
                                                                                const val = e.target.value;
                                                                                if (val && val !== String(task.duration_hours) && onDurationChange) {
                                                                                    onDurationChange(String(task.id), val);
                                                                                }
                                                                            }}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            className="duration-input-field"
                                                                        />
                                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '5px' }}>hrs spent</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
