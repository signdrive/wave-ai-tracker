import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Clock, AlertTriangle, Plus, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

interface CheckIn {
  id: string;
  location: string;
  plannedReturn: string;
  actualReturn?: string;
  contacts: string[];
  status: 'active' | 'completed' | 'overdue';
  timestamp: string;
}

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Emergency Services',
      phone: '112',
      relationship: 'Emergency',
      isPrimary: false
    },
    {
      id: '2',
      name: 'Coast Guard',
      phone: '113',
      relationship: 'Emergency',
      isPrimary: false
    }
  ]);
  
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  });
  const [newCheckIn, setNewCheckIn] = useState({
    location: '',
    plannedReturn: '',
    selectedContacts: [] as string[]
  });
  const [showAddContact, setShowAddContact] = useState(false);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load contacts and check-ins from localStorage
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
      setContacts(prev => [...prev, ...JSON.parse(savedContacts)]);
    }

    const savedCheckIns = localStorage.getItem('checkIns');
    if (savedCheckIns) {
      setCheckIns(JSON.parse(savedCheckIns));
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever contacts change
    const userContacts = contacts.filter(c => !['112', '113'].includes(c.phone));
    localStorage.setItem('emergencyContacts', JSON.stringify(userContacts));
  }, [contacts]);

  useEffect(() => {
    // Save check-ins and check for overdue ones
    localStorage.setItem('checkIns', JSON.stringify(checkIns));
    
    const now = new Date();
    checkIns.forEach(checkIn => {
      if (checkIn.status === 'active' && new Date(checkIn.plannedReturn) < now) {
        setCheckIns(prev => prev.map(c => 
          c.id === checkIn.id ? { ...c, status: 'overdue' as const } : c
        ));
        
        // Send overdue notification
        toast({
          title: "Check-in Overdue!",
          description: `You're overdue for check-in from ${checkIn.location}`,
          variant: "destructive"
        });
      }
    });
  }, [checkIns, toast]);

  const addContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact,
      isPrimary: false
    };

    setContacts(prev => [...prev, contact]);
    setNewContact({ name: '', phone: '', relationship: '' });
    setShowAddContact(false);
    
    toast({
      title: "Contact Added",
      description: `${contact.name} has been added to your emergency contacts`
    });
  };

  const removeContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    toast({
      title: "Contact Removed",
      description: "Emergency contact has been removed"
    });
  };

  const startCheckIn = () => {
    if (!newCheckIn.location || !newCheckIn.plannedReturn || newCheckIn.selectedContacts.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select at least one contact",
        variant: "destructive"
      });
      return;
    }

    const checkIn: CheckIn = {
      id: Date.now().toString(),
      location: newCheckIn.location,
      plannedReturn: newCheckIn.plannedReturn,
      contacts: newCheckIn.selectedContacts,
      status: 'active',
      timestamp: new Date().toISOString()
    };

    setCheckIns(prev => [...prev, checkIn]);
    setNewCheckIn({ location: '', plannedReturn: '', selectedContacts: [] });
    setShowCheckInForm(false);

    toast({
      title: "Check-in Started",
      description: `Active check-in for ${checkIn.location} until ${new Date(checkIn.plannedReturn).toLocaleString()}`
    });
  };

  const completeCheckIn = (id: string) => {
    setCheckIns(prev => prev.map(c => 
      c.id === id ? { 
        ...c, 
        status: 'completed' as const, 
        actualReturn: new Date().toISOString() 
      } : c
    ));

    toast({
      title: "Check-in Complete",
      description: "You've successfully checked in!"
    });
  };

  const getStatusColor = (status: CheckIn['status']) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Emergency Contacts & Check-in</h1>
        <p className="text-muted-foreground">
          Manage your emergency contacts and safety check-ins
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Emergency Contacts */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Emergency Contacts</h2>
            <Button onClick={() => setShowAddContact(!showAddContact)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>

          {showAddContact && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                    placeholder="Friend, Family, etc."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addContact}>Add Contact</Button>
                  <Button variant="outline" onClick={() => setShowAddContact(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {contacts.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4" />
                        <h3 className="font-semibold">{contact.name}</h3>
                        {contact.isPrimary && (
                          <Badge variant="default">Primary</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {contact.phone}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {contact.relationship}
                      </p>
                    </div>
                    {!['112', '113'].includes(contact.phone) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContact(contact.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Check-in System */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Safety Check-ins</h2>
            <Button onClick={() => setShowCheckInForm(!showCheckInForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Start Check-in
            </Button>
          </div>

          {showCheckInForm && (
            <Card>
              <CardHeader>
                <CardTitle>Start Safety Check-in</CardTitle>
                <CardDescription>
                  Let your contacts know where you're going and when you plan to return
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newCheckIn.location}
                    onChange={(e) => setNewCheckIn(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Where are you surfing?"
                  />
                </div>
                <div>
                  <Label htmlFor="plannedReturn">Planned Return Time</Label>
                  <Input
                    id="plannedReturn"
                    type="datetime-local"
                    value={newCheckIn.plannedReturn}
                    onChange={(e) => setNewCheckIn(prev => ({ ...prev, plannedReturn: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Notify Contacts</Label>
                  <div className="space-y-2 mt-2">
                    {contacts.filter(c => !['112', '113'].includes(c.phone)).map((contact) => (
                      <label key={contact.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newCheckIn.selectedContacts.includes(contact.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewCheckIn(prev => ({
                                ...prev,
                                selectedContacts: [...prev.selectedContacts, contact.id]
                              }));
                            } else {
                              setNewCheckIn(prev => ({
                                ...prev,
                                selectedContacts: prev.selectedContacts.filter(id => id !== contact.id)
                              }));
                            }
                          }}
                        />
                        <span className="text-sm">{contact.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={startCheckIn}>Start Check-in</Button>
                  <Button variant="outline" onClick={() => setShowCheckInForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Check-ins */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Check-in History</h3>
            {checkIns.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No check-ins yet</p>
                </CardContent>
              </Card>
            ) : (
              checkIns.map((checkIn) => (
                <Card key={checkIn.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4" />
                          <h3 className="font-semibold">{checkIn.location}</h3>
                          <Badge className={getStatusColor(checkIn.status)}>
                            {checkIn.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Started: {new Date(checkIn.timestamp).toLocaleString()}</p>
                          <p>Planned return: {new Date(checkIn.plannedReturn).toLocaleString()}</p>
                          {checkIn.actualReturn && (
                            <p>Actual return: {new Date(checkIn.actualReturn).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                      {checkIn.status === 'active' && (
                        <Button onClick={() => completeCheckIn(checkIn.id)}>
                          Check In
                        </Button>
                      )}
                    </div>
                    
                    {checkIn.status === 'overdue' && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-semibold">Overdue Check-in</span>
                        </div>
                        <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                          Please check in immediately to notify your contacts you're safe.
                        </p>
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => completeCheckIn(checkIn.id)}
                        >
                          I'm Safe - Check In Now
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}