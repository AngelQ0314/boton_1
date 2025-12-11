import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Period } from './schemas/period.schema';

@Injectable()
export class PeriodsService {
  constructor(
    @InjectModel(Period.name) private model: Model<Period>,
  ) {}

  // 🔥 Transforma el JSON crudo de Mongo al formato EXACTO que tu Angular necesita
  transform(period: any) {
    return {
      _id: period._id?.base64 ?? period._id,
      restaurant_id: period.restaurant_id?.base64 ?? period.restaurant_id,
      user_id: period.user_id?.base64 ?? period.user_id,
      cdn_id: period.cdn_id?.base64 ?? period.cdn_id,

      restaurant_name: period.restaurant_name ?? "",
      cdn_restaurant_name: period.cdn_restaurant_name ?? "",

      start_date: period.start_date,
      final_date: period.final_date ?? null,

      periodtype: period.periodtype ?? "",

      // ✔ Saca solo el nombre del status
      status_name: period.status_Period?.status_name ?? "Desconocido",
    };
  }

async findAll(query: any) {
  const { 
    search,
    dateFilter,
    start,
    end,
    cdn_restaurant_name,
    restaurant_name,
    status_name
  } = query;

  const filter: any = {};

  // 🔎 Búsqueda general
  if (search) {
    filter.$or = [
      { restaurant_name: { $regex: search, $options: 'i' } },
      { cdn_restaurant_name: { $regex: search, $options: 'i' } },
      { periodtype: { $regex: search, $options: 'i' } },
      { "status_Period.status_name": { $regex: search, $options: 'i' } },
    ];
  }

  // 🔎 Filtrar por nombre de cadena
  if (cdn_restaurant_name) {
    filter.cdn_restaurant_name = { $regex: cdn_restaurant_name, $options: 'i' };
  }

  // 🔎 Filtrar por nombre de restaurante
  if (restaurant_name) {
    filter.restaurant_name = { $regex: restaurant_name, $options: 'i' };
  }

  // 🔎 Filtrar por estado
  if (status_name && status_name !== 'all') {
    filter["status_Period.status_name"] = status_name;
  }

  // 📅 Filtro de fechas
  let startD: Date | undefined;
  let endD: Date | undefined;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dateFilter && dateFilter !== 'all') {
    switch (dateFilter) {
      case "today":
        startD = today;
        endD = new Date(today);
        endD.setHours(23, 59, 59, 999);
        break;

      case "week":
        startD = new Date(today);
        startD.setDate(today.getDate() - today.getDay());
        endD = new Date(startD);
        endD.setDate(startD.getDate() + 6);
        endD.setHours(23, 59, 59, 999);
        break;

      case "month":
        startD = new Date(today.getFullYear(), today.getMonth(), 1);
        endD = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endD.setHours(23, 59, 59, 999);
        break;

      case "custom":
        if (start && end) {
          startD = new Date(start);
          endD = new Date(end);
          endD.setHours(23, 59, 59, 999);
        }
        break;
    }
  }

  if (startD && endD) {
    filter.start_date = { $gte: startD, $lte: endD };
  }

  try {
    const periods = await this.model
      .find(filter)
      .sort({ start_date: -1 })
      .lean();

    return periods.map(p => this.transform(p));
  } catch (error) {
    console.error('Error in findAll:', error);
    return [];
  }
}
}
