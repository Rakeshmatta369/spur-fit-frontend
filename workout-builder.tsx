'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { ArrowLeft, MoreVertical, GripVertical } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface WorkoutBlock {
  id: string
  type: string
  name: string
  distance: number
  fill: number
  subBlocks?: { fill: number }[]
}

const initialBlocks: WorkoutBlock[] = [
  { id: 'warm-up', type: 'single', name: 'Warm Up', fill: 50, distance: 2 },
  { id: 'active', type: 'single', name: 'Active', fill: 75, distance: 3 },
  { id: 'cool-down', type: 'single', name: 'Cool Down', fill: 25, distance: 1 },
  { id: 'two-steps', type: 'multi', name: 'Two Steps', subBlocks: [{ fill: 50 }, { fill: 25 }], distance: 2.5 },
  { id: 'ramp-up', type: 'multi', name: 'Ramp Up', subBlocks: [{ fill: 25 }, { fill: 50 }, { fill: 75 }, { fill: 100 }], distance: 4 },
  { id: 'ramp-down', type: 'multi', name: 'Ramp Down', subBlocks: [{ fill: 100 }, { fill: 75 }, { fill: 50 }, { fill: 25 }], distance: 4 },
]

export default function WorkoutBuilder() {
  const [droppedBlocks, setDroppedBlocks] = useState<WorkoutBlock[]>([])

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId === 'blocks' && destination.droppableId === 'workout') {
      const newBlock = { ...initialBlocks.find(b => b.id === result.draggableId)!, id: `${result.draggableId}-${Date.now()}` }
      const newDroppedBlocks = Array.from(droppedBlocks)
      newDroppedBlocks.splice(destination.index, 0, newBlock)
      setDroppedBlocks(newDroppedBlocks)
    }
  }

  const clearBlocks = () => {
    setDroppedBlocks([]);
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Workout</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={clearBlocks} className="bg-red-500 text-white hover:bg-red-600 mr-2">
              Clear Blocks
            </Button>
            <Button className="bg-[#6366F1] text-white hover:bg-[#5558E8]">
              Save Workout
            </Button>
          </div>
        </header>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-[300px,1fr] gap-8">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-900">Click or drag the blocks to build workout</h2>
              </div>
              <Droppable droppableId="blocks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid gap-4"
                  >
                    {initialBlocks.map((block, index) => (
                      <Draggable key={block.id} draggableId={block.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="h-12 bg-[#EEF2FF] rounded flex items-center px-3"
                          >
                            <div className="w-8 h-8 bg-[#818CF8] rounded mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{block.name}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="relative h-[400px]">
                {/* Percentage scale */}
                <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-between py-4 text-xs text-gray-500">
                  <span>150%</span>
                  <span>125%</span>
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>

                {/* Graph area */}
                <Droppable droppableId="workout" direction="horizontal">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="absolute left-16 right-4 top-0 bottom-8"
                      style={{
                        backgroundImage: 'linear-gradient(to right, #F3F4F6 1px, transparent 1px), linear-gradient(to bottom, #F3F4F6 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                      }}
                    >
                      {droppedBlocks.map((block, index) => (
                        <Draggable key={block.id} draggableId={block.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="absolute bottom-0 bg-[#818CF8] rounded-t flex"
                              style={{
                                left: `${droppedBlocks.slice(0, index).reduce((acc, b) => acc + b.distance * 30, 0)}px`,
                                width: `${block.distance * 30}px`,
                                height: `${block.fill}%`,
                                marginRight: '4px', // Add padding between blocks
                              }}
                            >
                              {block.type === 'multi' && block.subBlocks ? (
                                block.subBlocks.map((subBlock, subIndex) => (
                                  <div
                                    key={subIndex}
                                    className="flex-1 bg-[#818CF8]"
                                    style={{ height: `${subBlock.fill}%` }}
                                  />
                                ))
                              ) : (
                                <div className="w-full h-full" />
                              )}
                              <div className="absolute bottom-[-20px] left-0 right-0 text-xs text-gray-500 text-center">
                                {block.distance} km
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <div className="absolute left-16 right-4 bottom-0 h-8 flex items-center">
                  {droppedBlocks.reduce((acc, block, index) => {
                    const prevDistance = acc[index] || 0;
                    const newDistance = prevDistance + block.distance;
                    acc.push(newDistance);
                    return acc;
                  }, [0]).map((distance, index) => (
                    <div key={index} className="absolute text-xs text-gray-500" style={{ left: `${droppedBlocks.slice(0, index).reduce((acc, b) => acc + b.distance * 30, 0)}px` }}>
                      {distance} km
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom section with sub-blocks */}
              <div className="border-t border-gray-200 p-4">
                {droppedBlocks.map((block, index) => (
                  <div key={block.id} className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{block.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{block.distance} km</span>
                      <Button variant="outline" className="text-[#6366F1] border-[#6366F1] hover:bg-[#EEF2FF]">
                        Add Substep
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}

