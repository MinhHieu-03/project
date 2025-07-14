import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Filter, Building2, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  warehouses, 
  warehouseAreas, 
  racks, 
  pricingRules,
  type Warehouse,
  type WarehouseArea,
  type Rack,
  type PricingRule
} from "@/data/warehouseData";

const WarehouseLayoutConfig = () => {
  const { toast } = useToast();
  
  const [warehousesData, setWarehousesData] = useState<Warehouse[]>(warehouses);
  const [areasData, setAreasData] = useState<WarehouseArea[]>(warehouseAreas);
  const [racksData, setRacksData] = useState<Rack[]>(racks);
  const [pricingData, setPricingData] = useState<PricingRule[]>(pricingRules);
  
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [editingArea, setEditingArea] = useState<WarehouseArea | null>(null);
  const [editingRack, setEditingRack] = useState<Rack | null>(null);
  const [editingPricing, setEditingPricing] = useState<PricingRule | null>(null);

  const [warehouseDialogOpen, setWarehouseDialogOpen] = useState(false);
  const [areaDialogOpen, setAreaDialogOpen] = useState(false);
  const [rackDialogOpen, setRackDialogOpen] = useState(false);
  const [pricingDialogOpen, setPricingDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    const variants = {
      empty: "secondary",
      occupied: "default", 
      maintenance: "destructive",
      reserved: "outline",
      active: "default",
      inactive: "secondary"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  const handleSaveWarehouse = (formData: FormData) => {
    const warehouse: Warehouse = {
      id: editingWarehouse?.id || `wh-${Date.now()}`,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      status: formData.get("status") as "active" | "inactive" | "maintenance",
      totalAreas: parseInt(formData.get("totalAreas") as string) || 0,
      totalRacks: parseInt(formData.get("totalRacks") as string) || 0
    };

    if (editingWarehouse) {
      setWarehousesData(prev => prev.map(w => w.id === warehouse.id ? warehouse : w));
      toast({ title: "Warehouse updated successfully" });
    } else {
      setWarehousesData(prev => [...prev, warehouse]);
      toast({ title: "Warehouse created successfully" });
    }
    
    setWarehouseDialogOpen(false);
    setEditingWarehouse(null);
  };

  const handleDeleteWarehouse = (id: string) => {
    setWarehousesData(prev => prev.filter(w => w.id !== id));
    toast({ title: "Warehouse deleted successfully" });
  };

  const handleSaveArea = (formData: FormData) => {
    const area: WarehouseArea = {
      id: editingArea?.id || `area-${Date.now()}`,
      warehouseId: formData.get("warehouseId") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as WarehouseArea["type"],
      status: formData.get("status") as "active" | "inactive" | "maintenance",
      capacity: parseInt(formData.get("capacity") as string) || 0,
      currentUtilization: parseInt(formData.get("currentUtilization") as string) || 0,
      createdAt: editingArea?.createdAt || new Date().toISOString()
    };

    if (editingArea) {
      setAreasData(prev => prev.map(a => a.id === area.id ? area : a));
      toast({ title: "Area updated successfully" });
    } else {
      setAreasData(prev => [...prev, area]);
      toast({ title: "Area created successfully" });
    }
    
    setAreaDialogOpen(false);
    setEditingArea(null);
  };

  const handleDeleteArea = (id: string) => {
    setAreasData(prev => prev.filter(a => a.id !== id));
    toast({ title: "Area deleted successfully" });
  };

  const handleSaveRack = (formData: FormData) => {
    const rack: Rack = {
      id: editingRack?.id || `rack-${Date.now()}`,
      areaId: formData.get("areaId") as string,
      locationCode: formData.get("locationCode") as string,
      row: parseInt(formData.get("row") as string) || 0,
      column: parseInt(formData.get("column") as string) || 0,
      level: parseInt(formData.get("level") as string) || 0,
      status: formData.get("status") as Rack["status"],
      warehouse: formData.get("warehouse") as string,
      area: formData.get("area") as string,
      capacity: parseInt(formData.get("capacity") as string) || 0,
      currentLoad: parseInt(formData.get("currentLoad") as string) || 0,
      dimensions: {
        width: parseFloat(formData.get("width") as string) || 0,
        height: parseFloat(formData.get("height") as string) || 0,
        depth: parseFloat(formData.get("depth") as string) || 0
      },
      createdAt: editingRack?.createdAt || new Date().toISOString()
    };

    if (editingRack) {
      setRacksData(prev => prev.map(r => r.id === rack.id ? rack : r));
      toast({ title: "Rack updated successfully" });
    } else {
      setRacksData(prev => [...prev, rack]);
      toast({ title: "Rack created successfully" });
    }
    
    setRackDialogOpen(false);
    setEditingRack(null);
  };

  const handleDeleteRack = (id: string) => {
    setRacksData(prev => prev.filter(r => r.id !== id));
    toast({ title: "Rack deleted successfully" });
  };

  const handleSavePricing = (formData: FormData) => {
    const pricing: PricingRule = {
      id: editingPricing?.id || `price-${Date.now()}`,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as PricingRule["type"],
      unitType: formData.get("unitType") as PricingRule["unitType"],
      basePrice: parseFloat(formData.get("basePrice") as string) || 0,
      currency: formData.get("currency") as string,
      conditions: {
        minVolume: formData.get("minVolume") ? parseFloat(formData.get("minVolume") as string) : undefined,
        maxVolume: formData.get("maxVolume") ? parseFloat(formData.get("maxVolume") as string) : undefined,
        itemType: formData.get("itemType") as string || undefined,
        priority: formData.get("priority") as PricingRule["conditions"]["priority"] || undefined,
      },
      status: formData.get("status") as "active" | "inactive",
      createdAt: editingPricing?.createdAt || new Date().toISOString()
    };

    if (editingPricing) {
      setPricingData(prev => prev.map(p => p.id === pricing.id ? pricing : p));
      toast({ title: "Pricing rule updated successfully" });
    } else {
      setPricingData(prev => [...prev, pricing]);
      toast({ title: "Pricing rule created successfully" });
    }
    
    setPricingDialogOpen(false);
    setEditingPricing(null);
  };

  const handleDeletePricing = (id: string) => {
    setPricingData(prev => prev.filter(p => p.id !== id));
    toast({ title: "Pricing rule deleted successfully" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Building2 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Layout Configuration</h1>
      </div>

      <Tabs defaultValue="warehouses" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="areas">Areas</TabsTrigger>
          <TabsTrigger value="racks">Rack Structure</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Structure</TabsTrigger>
        </TabsList>

        <TabsContent value="warehouses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Warehouse Management</CardTitle>
                <Dialog open={warehouseDialogOpen} onOpenChange={setWarehouseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { setEditingWarehouse(null); setWarehouseDialogOpen(true); }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Warehouse
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingWarehouse ? "Edit Warehouse" : "Create New Warehouse"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveWarehouse(new FormData(e.currentTarget)); }} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          defaultValue={editingWarehouse?.name || ""} 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Input 
                          id="description" 
                          name="description" 
                          defaultValue={editingWarehouse?.description || ""} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          name="location" 
                          defaultValue={editingWarehouse?.location || ""} 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={editingWarehouse?.status || "active"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="totalAreas">Total Areas</Label>
                          <Input 
                            id="totalAreas" 
                            name="totalAreas" 
                            type="number" 
                            defaultValue={editingWarehouse?.totalAreas || 0} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="totalRacks">Total Racks</Label>
                          <Input 
                            id="totalRacks" 
                            name="totalRacks" 
                            type="number" 
                            defaultValue={editingWarehouse?.totalRacks || 0} 
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        {editingWarehouse ? "Update" : "Create"} Warehouse
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Areas</TableHead>
                    <TableHead>Racks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehousesData.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-medium">{warehouse.name}</TableCell>
                      <TableCell>{warehouse.description}</TableCell>
                      <TableCell>{warehouse.location}</TableCell>
                      <TableCell>{getStatusBadge(warehouse.status)}</TableCell>
                      <TableCell>{warehouse.totalAreas}</TableCell>
                      <TableCell>{warehouse.totalRacks}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => { setEditingWarehouse(warehouse); setWarehouseDialogOpen(true); }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => handleDeleteWarehouse(warehouse.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Area Management</CardTitle>
                <Dialog open={areaDialogOpen} onOpenChange={setAreaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { setEditingArea(null); setAreaDialogOpen(true); }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Area
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingArea ? "Edit Area" : "Create New Area"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveArea(new FormData(e.currentTarget)); }} className="space-y-4">
                      <div>
                        <Label htmlFor="warehouseId">Warehouse</Label>
                        <Select name="warehouseId" defaultValue={editingArea?.warehouseId || (warehousesData[0]?.id || "")}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {warehousesData.map(w => (
                              <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          defaultValue={editingArea?.name || ""} 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Input 
                          id="description" 
                          name="description" 
                          defaultValue={editingArea?.description || ""} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select name="type" defaultValue={editingArea?.type || "storage"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="storage">Storage</SelectItem>
                            <SelectItem value="inbound">Inbound</SelectItem>
                            <SelectItem value="outbound">Outbound</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="quality_control">Quality Control</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={editingArea?.status || "active"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="capacity">Capacity</Label>
                          <Input 
                            id="capacity" 
                            name="capacity" 
                            type="number" 
                            defaultValue={editingArea?.capacity || 0} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="currentUtilization">Current Utilization</Label>
                          <Input 
                            id="currentUtilization" 
                            name="currentUtilization" 
                            type="number" 
                            defaultValue={editingArea?.currentUtilization || 0} 
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        {editingArea ? "Update" : "Create"} Area
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Current Utilization</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {areasData.map((area) => {
                    const warehouseName = warehousesData.find(w => w.id === area.warehouseId)?.name || "";
                    return (
                      <TableRow key={area.id}>
                        <TableCell className="font-medium">{area.name}</TableCell>
                        <TableCell>{area.description}</TableCell>
                        <TableCell>{warehouseName}</TableCell>
                        <TableCell>{area.type}</TableCell>
                        <TableCell>{getStatusBadge(area.status)}</TableCell>
                        <TableCell>{area.capacity}</TableCell>
                        <TableCell>{area.currentUtilization}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => { setEditingArea(area); setAreaDialogOpen(true); }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => handleDeleteArea(area.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="racks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Rack Structure Management</CardTitle>
                <Dialog open={rackDialogOpen} onOpenChange={setRackDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { setEditingRack(null); setRackDialogOpen(true); }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Rack
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingRack ? "Edit Rack" : "Create New Rack"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveRack(new FormData(e.currentTarget)); }} className="space-y-4">
                      <div>
                        <Label htmlFor="areaId">Area</Label>
                        <Select name="areaId" defaultValue={editingRack?.areaId || (areasData[0]?.id || "")}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {areasData.map(a => (
                              <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="locationCode">Location Code</Label>
                        <Input 
                          id="locationCode" 
                          name="locationCode" 
                          defaultValue={editingRack?.locationCode || ""} 
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="row">Row</Label>
                          <Input 
                            id="row" 
                            name="row" 
                            type="number" 
                            defaultValue={editingRack?.row || 0} 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="column">Column</Label>
                          <Input 
                            id="column" 
                            name="column" 
                            type="number" 
                            defaultValue={editingRack?.column || 0} 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="level">Level</Label>
                          <Input 
                            id="level" 
                            name="level" 
                            type="number" 
                            defaultValue={editingRack?.level || 0} 
                            required 
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={editingRack?.status || "empty"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="empty">Empty</SelectItem>
                            <SelectItem value="occupied">Occupied</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="reserved">Reserved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="warehouse">Warehouse</Label>
                        <Input 
                          id="warehouse" 
                          name="warehouse" 
                          defaultValue={editingRack?.warehouse || ""} 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="area">Area</Label>
                        <Input 
                          id="area" 
                          name="area" 
                          defaultValue={editingRack?.area || ""} 
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="capacity">Capacity</Label>
                          <Input 
                            id="capacity" 
                            name="capacity" 
                            type="number" 
                            defaultValue={editingRack?.capacity || 0} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="currentLoad">Current Load</Label>
                          <Input 
                            id="currentLoad" 
                            name="currentLoad" 
                            type="number" 
                            defaultValue={editingRack?.currentLoad || 0} 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="width">Width (m)</Label>
                          <Input 
                            id="width" 
                            name="width" 
                            type="number" 
                            step="0.01"
                            defaultValue={editingRack?.dimensions?.width || 0} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="height">Height (m)</Label>
                          <Input 
                            id="height" 
                            name="height" 
                            type="number" 
                            step="0.01"
                            defaultValue={editingRack?.dimensions?.height || 0} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="depth">Depth (m)</Label>
                          <Input 
                            id="depth" 
                            name="depth" 
                            type="number" 
                            step="0.01"
                            defaultValue={editingRack?.dimensions?.depth || 0} 
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        {editingRack ? "Update" : "Create"} Rack
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location Code</TableHead>
                    <TableHead>Row</TableHead>
                    <TableHead>Column</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Current Load</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {racksData.map((rack) => (
                    <TableRow key={rack.id}>
                      <TableCell className="font-medium">{rack.locationCode}</TableCell>
                      <TableCell>{rack.row}</TableCell>
                      <TableCell>{rack.column}</TableCell>
                      <TableCell>{rack.level}</TableCell>
                      <TableCell>{getStatusBadge(rack.status)}</TableCell>
                      <TableCell>{rack.warehouse}</TableCell>
                      <TableCell>{rack.area}</TableCell>
                      <TableCell>{rack.capacity}</TableCell>
                      <TableCell>{rack.currentLoad}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => { setEditingRack(rack); setRackDialogOpen(true); }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => handleDeleteRack(rack.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Pricing Configuration</CardTitle>
                <Dialog open={pricingDialogOpen} onOpenChange={setPricingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { setEditingPricing(null); setPricingDialogOpen(true); }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Pricing Rule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingPricing ? "Edit Pricing Rule" : "Create New Pricing Rule"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); handleSavePricing(new FormData(e.currentTarget)); }} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          defaultValue={editingPricing?.name || ""} 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Input 
                          id="description" 
                          name="description" 
                          defaultValue={editingPricing?.description || ""} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select name="type" defaultValue={editingPricing?.type || "storage"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="storage">Storage</SelectItem>
                            <SelectItem value="handling">Handling</SelectItem>
                            <SelectItem value="transport">Transport</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="unitType">Unit Type</Label>
                        <Select name="unitType" defaultValue={editingPricing?.unitType || "per_item"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="per_item">Per Item</SelectItem>
                            <SelectItem value="per_hour">Per Hour</SelectItem>
                            <SelectItem value="per_day">Per Day</SelectItem>
                            <SelectItem value="per_month">Per Month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="basePrice">Base Price</Label>
                        <Input 
                          id="basePrice" 
                          name="basePrice" 
                          type="number" 
                          step="0.01"
                          defaultValue={editingPricing?.basePrice || 0} 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Input 
                          id="currency" 
                          name="currency" 
                          defaultValue={editingPricing?.currency || "USD"} 
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="minVolume">Min Volume</Label>
                          <Input 
                            id="minVolume" 
                            name="minVolume" 
                            type="number" 
                            step="0.01"
                            defaultValue={editingPricing?.conditions.minVolume || ""} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxVolume">Max Volume</Label>
                          <Input 
                            id="maxVolume" 
                            name="maxVolume" 
                            type="number" 
                            step="0.01"
                            defaultValue={editingPricing?.conditions.maxVolume || ""} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="itemType">Item Type</Label>
                          <Input 
                            id="itemType" 
                            name="itemType" 
                            defaultValue={editingPricing?.conditions.itemType || ""} 
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select name="priority" defaultValue={editingPricing?.conditions.priority || "medium"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={editingPricing?.status || "active"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full">
                        {editingPricing ? "Update" : "Create"} Pricing Rule
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Unit Type</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Min Volume</TableHead>
                    <TableHead>Max Volume</TableHead>
                    <TableHead>Item Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingData.map((pricing) => (
                    <TableRow key={pricing.id}>
                      <TableCell className="font-medium">{pricing.name}</TableCell>
                      <TableCell>{pricing.description}</TableCell>
                      <TableCell>{pricing.type}</TableCell>
                      <TableCell>{pricing.unitType}</TableCell>
                      <TableCell>{pricing.basePrice.toFixed(2)}</TableCell>
                      <TableCell>{pricing.currency}</TableCell>
                      <TableCell>{pricing.conditions.minVolume ?? "-"}</TableCell>
                      <TableCell>{pricing.conditions.maxVolume ?? "-"}</TableCell>
                      <TableCell>{pricing.conditions.itemType || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={pricing.conditions.priority === 'high' ? 'destructive' : 
                                      pricing.conditions.priority === 'medium' ? 'default' : 'secondary'}>
                          {pricing.conditions.priority || "-"}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(pricing.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => { setEditingPricing(pricing); setPricingDialogOpen(true); }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => handleDeletePricing(pricing.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WarehouseLayoutConfig;
