import { ChildEntity } from 'typeorm'
import { User } from '@app/entity/User'

@ChildEntity()
export class Passenger extends User {}
