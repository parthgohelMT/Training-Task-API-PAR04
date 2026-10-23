import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface TaskAttributes {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskCreationAttributes
  extends Optional<TaskAttributes, 'id' | 'description' | 'completed' | 'createdAt' | 'updatedAt'> {}

export class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  declare public id: number;
  declare public title: string;
  declare public description: string | null;
  declare public completed: boolean;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: true
  }
);

export default Task;
