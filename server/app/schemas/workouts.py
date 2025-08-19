from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone

class Subset(Base):
    __tablename__ = "Subsets"
    id = Column(Integer,primary_key=True)
    set_id = Column(Integer, ForeignKey("Sets.id"))
    reps = Column(Integer)
    weight = Column(Float) # Unit: kg
    subset_number = Column(Integer)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

class Set(Base):
    __tablename__ = "Sets"
    id = Column(Integer, primary_key=True)
    exercise_id = Column(Integer, ForeignKey("Exercises.id"))
    exercise_name = Column(String)
    subsets = relationship("Subset", backref="set", cascade="all, delete-orphan")
    set_number = Column(Integer)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

class Exercise(Base):
    __tablename__ = "Exercises"
    id = Column(Integer, primary_key=True)
    workout_id = Column(Integer, ForeignKey("Workouts.id"))
    sets = relationship("Set", backref="exercise", cascade="all, delete-orphan")
    exercise_number = Column(Integer)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    @property
    def name(self):
        if not self.sets:
            return "Empty Exercise"
        unique_names = list(set(s.exercise_name for s in self.sets))
        if len(unique_names) == 1:
            return unique_names[0]
        return f"Superset - {', '.join(sorted(unique_names))}"

class Workout(Base):
    __tablename__ = "Workouts"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("Users.id"))
    exercises = relationship("Exercise", backref="workout", cascade="all, delete-orphan")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
