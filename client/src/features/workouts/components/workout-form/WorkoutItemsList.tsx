import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkoutItem, Exercise, SuperSet, isSuperset } from "../../types";
import { ExerciseForm } from "./ExerciseForm";
import { SupersetForm } from "./SupersetForm";

interface WorkoutItemsListProps {
    items: WorkoutItem[];
    onItemsChange: (items: WorkoutItem[]) => void;
    generateId: (prefix: string) => string;
}

export function WorkoutItemsList({
    items,
    onItemsChange,
    generateId
}: WorkoutItemsListProps) {
    // Create a new empty exercise
    const createEmptyExercise = (): Exercise => ({
        id: generateId('ex'),
        name: "",
        muscleGroup: "fullBody",
        sets: [
            {
                id: generateId('set'),
                weight: 0,
                reps: 10,
                completed: false
            }
        ]
    });

    // Add a new exercise to the workout
    const addExercise = () => {
        const newExercise = createEmptyExercise();
        onItemsChange([...items, newExercise]);
    };

    // Remove a workout item (exercise or superset)
    const removeItem = (itemIndex: number) => {
        const updatedItems = items.filter((_, i) => i !== itemIndex);
        onItemsChange(updatedItems);
    };

    // Update an exercise or superset
    const updateItem = (itemIndex: number, updatedItem: WorkoutItem) => {
        const updatedItems = [...items];
        updatedItems[itemIndex] = updatedItem;
        onItemsChange(updatedItems);
    };

    // Convert a regular exercise to a superset
    const convertToSuperset = (itemIndex: number) => {
        const updatedItems = [...items];
        const exercise = updatedItems[itemIndex] as Exercise;

        // Create superset with just the existing exercise
        const superset: SuperSet = {
            id: generateId('ss'),
            type: 'superset',
            exercises: [exercise]
        };

        updatedItems[itemIndex] = superset;
        onItemsChange(updatedItems);
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Exercises</h2>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                    <p className="text-gray-500 dark:text-gray-400">
                        No exercises added yet. Click "Add Exercise" to get started.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {items.map((item, index) => (
                        <div key={item.id}>
                            {isSuperset(item) ? (
                                <SupersetForm
                                    superset={item}
                                    onUpdate={(updatedSuperset) => updateItem(index, updatedSuperset)}
                                    onRemove={() => removeItem(index)}
                                    generateId={generateId}
                                />
                            ) : (
                                <ExerciseForm
                                    exercise={item as Exercise}
                                    onUpdate={(updatedExercise) => updateItem(index, updatedExercise)}
                                    onRemove={() => removeItem(index)}
                                    onConvertToSuperset={() => convertToSuperset(index)}
                                    generateId={generateId}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Exercise button */}
            <div className="mt-4 text-center">
                <Button
                    type="button"
                    onClick={addExercise}
                    className="flex items-center gap-1"
                >
                    <Dumbbell className="h-4 w-4" />
                    Add Exercise
                </Button>
            </div>
        </div>
    );
}