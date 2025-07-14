import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('material_recv_data')
@Index(['material_no'])
@Index(['pallet_id'])
@Index(['invoice_no'])
export class MaterialRecvData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nchar', length: 4, nullable: true })
  section_c: string;

  @Column({ type: 'nchar', length: 8, nullable: true })
  supplier_c: string;

  @Column({ type: 'nchar', length: 20, nullable: true })
  invoice_no: string;

  @Column({ type: 'nchar', length: 11, nullable: true })
  pallet_id: string;

  @Column({ type: 'nchar', length: 26, nullable: true })
  material_no: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  recv_qty: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  Scanned_qty: number;

  @Column({ type: 'nchar', length: 1, nullable: true })
  flg: string;

  @Column({ type: 'nchar', length: 8, nullable: true })
  userid: string;

  @Column({ type: 'datetime', name: 'ent_dt', nullable: true })
  ent_dt: Date;

  @Column({ type: 'datetime', name: 'upd_dt', nullable: true })
  upd_dt: Date;
}
